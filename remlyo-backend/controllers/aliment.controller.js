import Ailment from '../models/ailment.model.js';
import { AlimentCategories } from '../constants.js';

// Create a new ailment
const createAilment = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      symptoms,
      causesAndRisks,
      preventionTips,
      recommendedRemedies,
      relatedAilments,
      severity,
      isContagious,
      requiresMedicalAttention
    } = req.body;

    // Validate required fields
    if (!name || !description || !category) {
      return res.status(400).json({
        success: false,
        error: "Name, description, and category are required"
      });
    }

    // Validate category
    if (!AlimentCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: `Invalid category. Must be one of: ${AlimentCategories.join(', ')}`
      });
    }

    // Validate severity if provided
    if (severity && !['mild', 'moderate', 'severe'].includes(severity)) {
      return res.status(400).json({
        success: false,
        error: "Severity must be one of: mild, moderate, severe"
      });
    }

    // Check if ailment already exists
    const existingAilment = await Ailment.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingAilment) {
      return res.status(400).json({
        success: false,
        error: "An ailment with this name already exists"
      });
    }

    // Create new ailment
    const ailment = await Ailment.create({
      name,
      description,
      category,
      symptoms: symptoms || [],
      causesAndRisks: causesAndRisks || [],
      preventionTips: preventionTips || [],
      recommendedRemedies: recommendedRemedies || [],
      relatedAilments: relatedAilments || [],
      severity,
      isContagious: isContagious || false,
      requiresMedicalAttention: requiresMedicalAttention || false,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: "Ailment created successfully",
      data: ailment
    });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    res.status(500).json({
      success: false,
      error: error.message
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
      search 
    } = req.query;

    // Build filter
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (severity) filter.severity = severity;
    if (isContagious !== undefined) filter.isContagious = isContagious === 'true';
    if (requiresMedicalAttention !== undefined) filter.requiresMedicalAttention = requiresMedicalAttention === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const ailments = await Ailment.find(filter)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('recommendedRemedies')
      .populate('relatedAilments');

    const total = await Ailment.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        ailments,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single ailment
const getAilment = async (req, res) => {
  try {
    const { id } = req.params;

    const ailment = await Ailment.findById(id)
      .populate('recommendedRemedies')
      .populate('relatedAilments');

    if (!ailment) {
      return res.status(404).json({
        success: false,
        error: "Ailment not found"
      });
    }

    res.status(200).json({
      success: true,
      data: ailment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update ailment
const updateAilment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate category if provided
    if (updateData.category && !AlimentCategories.includes(updateData.category)) {
      return res.status(400).json({
        success: false,
        error: `Invalid category. Must be one of: ${AlimentCategories.join(', ')}`
      });
    }

    // Validate severity if provided
    if (updateData.severity && !['mild', 'moderate', 'severe'].includes(updateData.severity)) {
      return res.status(400).json({
        success: false,
        error: "Severity must be one of: mild, moderate, severe"
      });
    }

    const ailment = await Ailment.findById(id);
    if (!ailment) {
      return res.status(404).json({
        success: false,
        error: "Ailment not found"
      });
    }

    // Check for duplicate name if name is being updated
    if (updateData.name && updateData.name !== ailment.name) {
      const existingAilment = await Ailment.findOne({ 
        name: { $regex: new RegExp(`^${updateData.name}$`, 'i') } 
      });
      if (existingAilment) {
        return res.status(400).json({
          success: false,
          error: "An ailment with this name already exists"
        });
      }
    }

    const updatedAilment = await Ailment.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    )
    .populate('recommendedRemedies')
    .populate('relatedAilments');

    res.status(200).json({
      success: true,
      message: "Ailment updated successfully",
      data: updatedAilment
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    res.status(500).json({
      success: false,
      error: error.message
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
        error: "Ailment not found"
      });
    }

    ailment.isActive = false;
    await ailment.save();

    res.status(200).json({
      success: true,
      message: "Ailment deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
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
        error: "Ailment not found"
      });
    }

    if (ailment.recommendedRemedies.includes(remedyId)) {
      return res.status(400).json({
        success: false,
        error: "Remedy already added to this ailment"
      });
    }

    ailment.recommendedRemedies.push(remedyId);
    await ailment.save();

    const updatedAilment = await Ailment.findById(id)
      .populate('recommendedRemedies')
      .populate('relatedAilments');

    res.status(200).json({
      success: true,
      message: "Remedy added successfully",
      data: updatedAilment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
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
        error: "Ailment not found"
      });
    }

    ailment.recommendedRemedies = ailment.recommendedRemedies.filter(
      remedy => remedy.toString() !== remedyId
    );
    await ailment.save();

    const updatedAilment = await Ailment.findById(id)
      .populate('recommendedRemedies')
      .populate('relatedAilments');

    res.status(200).json({
      success: true,
      message: "Remedy removed successfully",
      data: updatedAilment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get ailments by category
const getAilmentsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!AlimentCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: `Invalid category. Must be one of: ${AlimentCategories.join(', ')}`
      });
    }

    const ailments = await Ailment.find({ 
      category,
      isActive: true 
    })
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('recommendedRemedies')
      .populate('relatedAilments');

    const total = await Ailment.countDocuments({ 
      category,
      isActive: true 
    });

    res.status(200).json({
      success: true,
      data: {
        ailments,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export {
  createAilment,
  getAllAilments,
  getAilment,
  updateAilment,
  deleteAilment,
  addRemedy,
  removeRemedy,
  getAilmentsByCategory
};
