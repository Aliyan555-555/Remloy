import mongoose from "mongoose";
import Remedy from "../models/remedy.model.js";
import { remedyValidation } from "../validations/remedy.validation.js";
import ModerationStatus from "./../models/moderation_status.model.js";

const createRemedy = async (req, res) => {
  try {
    const user = req.user;
    const { error } = remedyValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        success: false,
        details: error.details.map((d) => d.message),
      });
    }

    const newRemedy = await Remedy.create({
      ...req.body,
      createdBy: user.id,
    });

    res.status(201).json({
      message: "Remedy successfully created",
      success: true,
      remedy: newRemedy,
    });
  } catch (error) {
    console.error("Error creating remedy:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

const getAllRemedies = async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    const [remedies, totalRemedies] = await Promise.all([
      Remedy.find().populate("createdBy").skip(skip).limit(limit),
      Remedy.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      message: "Successfully fetched remedies",
      page,
      limit,
      totalRemedies,
      totalPages: Math.ceil(totalRemedies / limit),
      remedies,
    });
  } catch (error) {
    console.error("Error fetching remedies:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

const getRemedyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid remedy ID", success: false });
    }

    const remedy = await Remedy.findById(id);
    if (!remedy || !remedy.isActive) {
      return res
        .status(404)
        .json({ message: "Remedy not found or deleted", success: false });
    }

    res.status(200).json({
      message: "Successfully fetched remedy",
      remedy,
      success: false,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

const updateRemedy = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid remedy ID", success: false });
    }

    const { error } = remedyValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details,
        success: false,
      });
    }

    const remedy = await Remedy.findById(id);
    if (!remedy || remedy.isActive) {
      return res
        .status(404)
        .json({ message: "Remedy not found or inactive", success: false });
    }

    const user = req.user;
    if (
      user.id.toString() !== remedy.createdBy.toString() &&
      user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Permission denied", success: false });
    }

    Object.assign(remedy, req.body);
    await remedy.save();

    res.status(200).json({
      message: "Remedy successfully updated",
      remedy,
      success: true,
    });
  } catch (error) {
    console.error("Error updating remedy:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

const deleteRemedy = async (req, res) => {
  try {
    const { id } = req.params;
    const remedy = await Remedy.findById(id);
    if (!remedy || !remedy.isActive) {
      return res.status(404).json({
        message: "Remedy not found or already deleted",
        success: false,
      });
    }

    const deletedRemedy = await Remedy.findByIdAndDelete(id)

    res.status(200).json({
      message: "Remedy successfully deleted",
      success: true,
      id: deletedRemedy._id,
    });
  } catch (error) {
    console.error("Error soft deleting remedy:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const flagRemedy = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, note } = req.body;

    if (!reason?.trim() || !note?.trim()) {
      return res
        .status(400)
        .json({ message: "Reason and note are required.", success: false });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid remedy ID.", success: false });
    }

    const remedy = await Remedy.findById(id);
    if (!remedy || !remedy.isActive) {
      return res
        .status(404)
        .json({
          message: "Remedy not found or already inactive.",
          success: false,
        });
    }

    let moderationStatus = await ModerationStatus.findOne({
      contentId: id,
      contentType: "Remedy",
    });

    if (moderationStatus) {
      const alreadyFlagged = moderationStatus.moderationHistory?.some(
        (entry) => String(entry.userId) === String(req.user.id)
      );
      if (alreadyFlagged) {
        return res
          .status(400)
          .json({
            message: "You have already flagged this remedy.",
            success: false,
          });
      }
    }

    // Prepare new flag entry
    const flagEntry = {
      userId: req.user.id || undefined,
      reason: reason.trim(),
      note: note.trim(),
      flaggedAt: new Date(),
    };

    if (moderationStatus) {
      moderationStatus.flagCount += 1;
      moderationStatus.moderationHistory.push(flagEntry);
    } else {
      moderationStatus = new ModerationStatus({
        contentId: id,
        contentType: "Remedy",
        status: "pending",
        flagCount: 1,
        moderationHistory: [flagEntry],
      });
    }
    await moderationStatus.save();
    if (remedy.moderationStatus !== "pending") {
      remedy.moderationStatus = "pending";
    }

    // If flag count >= threshold, deactivate remedy
    if (
      moderationStatus.flagCount >= 5 // 5 is static i fetch in future with database
    ) {
      remedy.isActive = false;
    }

    await remedy.save();

    res.status(200).json({
      message: "Remedy flagged successfully.",
      success: true,
      moderationStatus,
    });
  } catch (error) {
    console.error("Error flagging remedy:", error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
      success: false,
    });
  }
};
export {
  flagRemedy,
  createRemedy,
  getAllRemedies,
  getRemedyById,
  updateRemedy,
  deleteRemedy,
};
