import Ailment from "../models/ailment.model.js";
import Remedy from "../models/remedy.model.js";
import { AilmentCategories } from "../constants/index.js";

// Create a new ailment
const createAilment = async (req, res) => {
  try {
    // Check if ailment already exists
    const existingAilment = await Ailment.findOne({
      name: { $regex: new RegExp(`^${req.body.name}$`, "i") },
    });

    if (existingAilment) {
      return res.status(400).json({
        success: false,
        error: "An ailment with this name already exists",
      });
    }

    // Create new ailment
    const ailment = await Ailment.create(req.body);

    res.status(201).json({
      success: true,
      message: "Ailment created successfully",
      data: ailment,
    });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all ailments with filtering
const getAllAilments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      severity,
      isContagious,
      requiresMedicalAttention,
      search,
    } = req.query;

    // Build filter
    const filter = {};
    if (category) filter.category = category;
    if (severity) filter.severity = severity;
    if (isContagious !== undefined)
      filter.isContagious = isContagious === "true";
    if (requiresMedicalAttention !== undefined)
      filter.requiresMedicalAttention = requiresMedicalAttention === "true";
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const ailments = await Ailment.find(filter)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("recommendedRemedies")
      .populate("relatedAilments");

    const total = await Ailment.countDocuments(filter);

    res.status(200).json({
      success: true,
      ailments,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get single ailment
const getAilment = async (req, res) => {
  try {
    const { id } = req.params;

    const ailment = await Ailment.findById(id)
      .populate("recommendedRemedies")
      .populate("relatedAilments");

    if (!ailment) {
      return res.status(404).json({
        success: false,
        error: "Ailment not found",
      });
    }

    res.status(200).json({
      success: true,
      ailment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update ailment
const updateAilment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate category if provided
    if (
      updateData.category &&
      !AilmentCategories.includes(updateData.category)
    ) {
      return res.status(400).json({
        success: false,
        error: `Invalid category. Must be one of: ${AilmentCategories.join(
          ", "
        )}`,
      });
    }

    // Validate severity if provided
    if (
      updateData.severity &&
      !["mild", "moderate", "severe"].includes(updateData.severity)
    ) {
      return res.status(400).json({
        success: false,
        error: "Severity must be one of: mild, moderate, severe",
      });
    }

    const ailment = await Ailment.findById(id);
    if (!ailment) {
      return res.status(404).json({
        success: false,
        error: "Ailment not found",
      });
    }

    // Check for duplicate name if name is being updated
    if (updateData.name && updateData.name !== ailment.name) {
      const existingAilment = await Ailment.findOne({
        name: { $regex: new RegExp(`^${updateData.name}$`, "i") },
      });
      if (existingAilment) {
        return res.status(400).json({
          success: false,
          error: "An ailment with this name already exists",
        });
      }
    }

    const updatedAilment = await Ailment.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("recommendedRemedies")
      .populate("relatedAilments");

    res.status(200).json({
      success: true,
      message: "Ailment updated successfully",
      data: updatedAilment,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete ailment (soft delete)
const deleteAilment = async (req, res) => {
  try {
    const { id } = req.params;

    const ailment = await Ailment.findById(id);
    if (!ailment) {
      return res.status(404).json({
        success: false,
        error: "Ailment not found",
      });
    }

    await Ailment.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Ailment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Add remedy to ailment
const addRemedy = async (req, res) => {
  try {
    const { id } = req.params;
    const { remedyId } = req.body;

    const ailment = await Ailment.findById(id);
    if (!ailment) {
      return res.status(404).json({
        success: false,
        error: "Ailment not found",
      });
    }

    if (ailment.recommendedRemedies.includes(remedyId)) {
      return res.status(400).json({
        success: false,
        error: "Remedy already added to this ailment",
      });
    }

    ailment.recommendedRemedies.push(remedyId);
    await ailment.save();

    const updatedAilment = await Ailment.findById(id)
      .populate("recommendedRemedies")
      .populate("relatedAilments");

    res.status(200).json({
      success: true,
      message: "Remedy added successfully",
      data: updatedAilment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Remove remedy from ailment
const removeRemedy = async (req, res) => {
  try {
    const { id, remedyId } = req.params;

    const ailment = await Ailment.findById(id);
    if (!ailment) {
      return res.status(404).json({
        success: false,
        error: "Ailment not found",
      });
    }

    ailment.recommendedRemedies = ailment.recommendedRemedies.filter(
      (remedy) => remedy.toString() !== remedyId
    );
    await ailment.save();

    const updatedAilment = await Ailment.findById(id)
      .populate("recommendedRemedies")
      .populate("relatedAilments");

    res.status(200).json({
      success: true,
      message: "Remedy removed successfully",
      data: updatedAilment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get ailments by category
const getAilmentsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!AilmentCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: `Invalid category. Must be one of: ${AilmentCategories.join(
          ", "
        )}`,
      });
    }

    const ailments = await Ailment.find({
      category,
    })
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("recommendedRemedies")
      .populate("relatedAilments");

    const total = await Ailment.countDocuments({
      category,
      isActive: true,
    });

    res.status(200).json({
      success: true,
      data: {
        ailments,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const checkSlugUniqueness = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required",
      });
    }

    // Find article with the given slug
    const existingArticle = await Ailment.findOne({ slug });

    return res.status(200).json({
      success: true,
      isUnique: !existingArticle,
      message: existingArticle ? "Slug already exists" : "Slug is available",
    });
  } catch (error) {
    console.error("Error checking slug uniqueness:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while checking slug uniqueness",
    });
  }
};

const generateSlug = async (req, res) => {
  try {
    const { name } = req.body;
    let slug;

    if (name) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
        .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
    } else {
      // Generate random slug if no name provided
      const randomString = Math.random().toString(36).substring(2, 8);
      slug = `article-${randomString}`;
    }

    // Check if slug exists and append number if needed
    let isUnique = false;
    let counter = 1;
    let finalSlug = slug;

    while (!isUnique) {
      const existingArticle = await Ailment.findOne({ slug: finalSlug });
      if (!existingArticle) {
        isUnique = true;
      } else {
        finalSlug = `${slug}-${counter}`;
        counter++;
      }
    }

    res.status(200).json({
      success: true,
      slug: finalSlug,
    });
  } catch (error) {
    console.error("Error generating slug:", error);
    res.status(500).json({
      success: false,
      message: "Error generating slug",
      error: error.message,
    });
  }
};

const getAilmentsWithCategoriesSorted = async (req, res) => {
  try {
    // Get all ailments
    const allAilments = await Ailment.find({}).select(
      "name slug category description _id"
    );

    // For each ailment, count remedies referencing it
    const ailmentIdToRemedyCount = {};
    await Promise.all(
      allAilments.map(async (ailment) => {
        const count = await Remedy.countDocuments({
          ailments: ailment._id,
        });
        ailmentIdToRemedyCount[ailment._id.toString()] = count;
      })
    );

    // Group ailments by category and add totalRemediesNo
    let result = AilmentCategories.map((category) => ({
      name: category,
      ailments: allAilments
        .filter((a) => a.category === category)
        .map((a) => ({
          ...a.toObject(),
          totalRemediesNo: ailmentIdToRemedyCount[a._id.toString()] || 0,
        })),
    }));

    // Remove categories with no ailments
    result = result.filter((cat) => cat.ailments.length > 0);

    // Get isCommon ailments
    const commonAilments = allAilments
      .filter((a) => a.isCommon)
      .map((a) => ({
        ...a.toObject(),
        totalRemediesNo: ailmentIdToRemedyCount[a._id.toString()] || 0,
      }));

    res.status(200).json({
      success: true,
      categories: result,
      commonAilments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch ailments by category",
      error: error.message,
    });
  }
};

const getAilmentBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    // Find the ailment by slug
    const ailment = await Ailment.findOne({ slug })
      .populate("recommendedRemedies")
      .populate("relatedAilments")
      .select(
        "name description slug category recommendedRemedies relatedAilments"
      );

    if (!ailment) {
      return res.status(404).json({
        success: false,
        message: "Ailment not found",
      });
    }
    const remediesCount = await Remedy.countDocuments({
      ailment: ailment._id,
    });

    const responseData = {
      ...ailment.toObject(),
      totalRemediesNo: remediesCount,
    };

    res.status(200).json({
      success: true,
      ailment: responseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch ailment by slug",
      error: error.message,
    });
  }
};

const getAilmentsWithOnlyName = async (req, res) => {
  try {
    // Only return active ailments, and include _id for selection
    const ailments = await Ailment.find().select("_id name");
    return res.status(200).json({
      success: true,
      message: "Successfully fetched ailments",
      ailments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch ailments",
      error: error.message,
    });
  }
};

export {
  getAilmentsWithOnlyName,
  checkSlugUniqueness,
  generateSlug,
  createAilment,
  getAllAilments,
  getAilment,
  updateAilment,
  deleteAilment,
  addRemedy,
  removeRemedy,
  getAilmentsByCategory,
  getAilmentsWithCategoriesSorted,
  getAilmentBySlug,
};
