import mongoose from "mongoose";
import Remedy from "../models/remedy.model.js";
import { remedyValidation } from "../validations/remedy.validation.js";
import ModerationStatus from "./../models/moderation_status.model.js";
import Flag from "../models/flag.model.js";
import Comment from "../models/comment.model.js";
import generateAiFeedback from "./../services/aiFeedback.service.js";
import {
  createCommentValidation,
  moderateCommentValidation,
} from "../validations/comment.validation.js";
import Review from "../models/review.model.js";
import generateRemedy from "../services/generateRemedy.service.js";
import AiFeedback from "../models/ai_feedback.model.js";
import User from "../models/user.model.js";
import UserProfile from "../models/user_profile.model.js";

const createRemedy = async (req, res) => {
  try {
    const user = req.user;
    // const { error } = remedyValidation.validate(req.body);
    // if (error) {
    //   return res.status(400).json({
    //     message: "Validation error",
    //     success: false,
    //     details: error.details.map((d) => d.message),
    //   });
    // }

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
    const search = req.query.search || "";

    // Build search query
    const searchQuery = {};
    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        // { ingredients: { $regex: search, $options: "i" } },
        { "createdBy.username": { $regex: search, $options: "i" } },
      ];
    }

    // Add filters for active remedies only
    // searchQuery.isActive = true;
    // searchQuery.moderationStatus = 'approved';

    const [remedies, totalRemedies] = await Promise.all([
      Remedy.find(searchQuery)
        .populate("createdBy", "username email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Remedy.countDocuments(searchQuery),
    ]);

    res.status(200).json({
      success: true,
      message: "Successfully fetched remedies",
      page,
      limit,
      totalRemedies,
      totalPages: Math.ceil(totalRemedies / limit),
      hasNextPage: page < Math.ceil(totalRemedies / limit),
      hasPrevPage: page > 1,
      search,
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

    const remedy = await Remedy.findById(id).populate(
      "createdBy",
      "username email profileImage status"
    );
    if (!remedy || !remedy.isActive) {
      return res
        .status(404)
        .json({ message: "Remedy not found or deleted", success: false });
    }

    let ratings = {};

    // 👉 If it's an AI-generated remedy, calculate extra data
    if (remedy.type === "ai") {
      const stats = await Review.aggregate([
        {
          $match: {
            remedyId: remedy._id,
          },
        },
        {
          $facet: {
            total: [{ $count: "count" }],
            positive: [
              { $match: { overallRating: { $gte: 4 } } },
              { $count: "count" },
            ],
            averages: [
              {
                $group: {
                  _id: null,
                  effectivenessAvg: { $avg: "$effectivenessRating" },
                  easeOfUseAvg: { $avg: "$easeOfUseRating" },
                  sideEffectsAvg: { $avg: "$sideEffectsRating" },
                  overallAvg: { $avg: "$overallRating" },
                },
              },
            ],
          },
        },
      ]);

      const total = stats[0].total[0]?.count || 0;
      const positive = stats[0].positive[0]?.count || 0;
      const avg = stats[0].averages[0] || {};

      ratings = {
        successRate: total > 0 ? Math.round((positive / total) * 100) : 0,
        totalReviews: total,
        positiveOutcomes: positive,
        averageRatings: {
          effectiveness: avg.effectivenessAvg || 0,
          easeOfUse: avg.easeOfUseAvg || 0,
          sideEffects: avg.sideEffectsAvg || 0,
          overall: avg.overallAvg || 0,
        },
      };
    }

    res.status(200).json({
      message: "Successfully fetched remedy",
      remedy: { ...remedy._doc, ratings },
      success: true,
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

    // const { error } = remedyValidation.validate(req.body);
    // if (error) {
    //   return res.status(400).json({
    //     message: "Validation error",
    //     details: error.details,
    //     success: false,
    //   });
    // }

    const remedy = await Remedy.findById(id);
    if (!remedy) {
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

    const deletedRemedy = await Remedy.findByIdAndDelete(id);

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

    // Input validation
    if (!reason?.trim() || !note?.trim()) {
      return res.status(400).json({
        message: "Reason, note, and category are required.",
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid remedy ID.",
        success: false,
      });
    }

    // Find the remedy
    const remedy = await Remedy.findById(id);
    if (!remedy) {
      return res.status(404).json({
        message: "Remedy not found or already inactive.",
        success: false,
      });
    }

    // Check if user has already flagged this remedy
    const existingFlag = await Flag.findOne({
      contentId: id,
      contentType: "Remedy",
      flaggedBy: req.user.id,
    });

    if (existingFlag) {
      return res.status(400).json({
        message: "You have already flagged this remedy.",
        success: false,
      });
    }

    // Create new flag
    const flag = new Flag({
      contentId: id,
      contentType: "Remedy",
      flaggedBy: req.user.id,
      reason: reason.trim(),
      note: note.trim(),
    });

    await flag.save();

    let moderationStatus = await ModerationStatus.findOne({
      contentId: id,
      contentType: "Remedy",
    });

    if (moderationStatus) {
      moderationStatus.moderationHistory.push(flag._id);
    } else {
      moderationStatus = new ModerationStatus({
        contentId: id,
        contentType: "Remedy",
        status: "under_review",
        flags: [flag._id],
        flagCount: 1,
        activeFlagCount: 1,
        lastFlaggedAt: new Date(),
      });
      await moderationStatus.save();
    }

    // Update remedy status
    remedy.moderationStatus = "under_review";

    // Check if remedy should be deactivated based on flag count
    const FLAG_THRESHOLD = 5; // This should be configurable
    if (moderationStatus.flagCount >= FLAG_THRESHOLD) {
      remedy.isActive = false;
      remedy.deactivationReason = "Exceeded flag threshold";
    }

    await remedy.save();

    // Populate flag details for response
    await flag.populate("flaggedBy", "username email");
    await moderationStatus.populate("flags");

    res.status(200).json({
      message: "Remedy flagged successfully.",
      success: true,
      data: {
        flag,
        moderationStatus,
      },
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

// 1. Create comment or reply
const createComment = async (req, res) => {
  try {
    // Validate input
    const { error } = createCommentValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        success: false,
        details: error.details.map((d) => d.message),
      });
    }

    const { content, remedyId, parentCommentId } = req.body;
    const userId = req.user.id;

    // Check remedy existence
    const remedy = await Remedy.findById(remedyId);
    if (!remedy || !remedy.isActive) {
      return res
        .status(404)
        .json({ message: "Remedy not found or inactive", success: false });
    }

    let level = 0;
    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId);
      if (!parent)
        return res
          .status(404)
          .json({ message: "Parent comment not found", success: false });
      level = parent.level + 1;
    }

    const comment = await Comment.create({
      content,
      remedyId,
      parentCommentId: parentCommentId || null,
      userId,
      level,
      upvoteCount: 0,
    });

    await comment.populate("userId", "username email profileImage status");

    res.status(201).json({
      message: "Successfully created comment",
      success: true,
      comment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create comment",
      error: error.message,
      success: false,
    });
  }
};

// 2. Get all comments for a remedy, as a tree, with pagination
const getAllCommentsByRemedyId = async (req, res) => {
  try {
    const { remedyId } = req.params;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(remedyId)) {
      return res
        .status(400)
        .json({ message: "Invalid remedy ID", success: false });
    }

    // Only fetch approved or pending comments
    const filter = { remedyId, status: { $in: ["pending", "approved"] } };

    // Fetch paginated root comments (no parent)
    const [total, rootComments] = await Promise.all([
      Comment.countDocuments({ ...filter, parentCommentId: null }),
      Comment.find({ ...filter, parentCommentId: null })
        .populate("userId", "username email profileImage status")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    // Get all comments for this remedy (for tree building)
    const allComments = await Comment.find(filter)
      .populate("userId", "username email profileImage status")
      .sort({ createdAt: 1 });

    // Build a map of comments by their _id
    const commentMap = {};
    allComments.forEach((comment) => {
      commentMap[comment._id.toString()] = comment.toObject();
      commentMap[comment._id.toString()].replies = [];
    });

    // Attach each comment to its parent
    allComments.forEach((comment) => {
      const c = commentMap[comment._id.toString()];
      if (c.parentCommentId) {
        const parent = commentMap[c.parentCommentId.toString()];
        if (parent) {
          parent.replies.push(c);
        }
      }
    });

    // For each paginated root comment, get its full subtree
    const commentsWithReplies = rootComments.map((root) => {
      return commentMap[root._id.toString()];
    });

    res.status(200).json({
      message: "Successfully fetched comments",
      success: true,
      comments: commentsWithReplies,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch comments",
      error: error.message,
      success: false,
    });
  }
};

const getRemediesByAilmentId = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, page = 1, limit = 10, sort } = req.query;

    // Build query
    const query = {
      ailments: id,
      isActive: true,
    };
    if (type) query.type = type;

    // Determine sort option
    let sortOption = { createdAt: -1 }; // Default: newest
    if (sort === "rating") {
      sortOption = { averageRating: -1 };
    }

    // Get total count for pagination
    const total = await Remedy.countDocuments(query);

    // Paginate remedies
    let remedies = await Remedy.find(query)
      .populate({
        path: "createdBy",
        select: "username profileImage",
      })
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Fix: Use Promise.all to resolve async map
    const updatedRemedy = await Promise.all(
      remedies.map(async (remedy) => {
        let ratings = {};

        // 👉 If it's an AI-generated remedy, calculate extra data
        if (remedy.type === "ai") {
          const stats = await Review.aggregate([
            {
              $match: {
                remedyId: remedy._id,
              },
            },
            {
              $facet: {
                total: [{ $count: "count" }],
                positive: [
                  { $match: { overallRating: { $gte: 4 } } },
                  { $count: "count" },
                ],
                averages: [
                  {
                    $group: {
                      _id: null,
                      effectivenessAvg: { $avg: "$effectivenessRating" },
                      easeOfUseAvg: { $avg: "$easeOfUseRating" },
                      sideEffectsAvg: { $avg: "$sideEffectsRating" },
                      overallAvg: { $avg: "$overallRating" },
                    },
                  },
                ],
              },
            },
          ]);

          const total = stats[0].total[0]?.count || 0;
          const positive = stats[0].positive[0]?.count || 0;
          const avg = stats[0].averages[0] || {};

          ratings = {
            successRate: total > 0 ? Math.round((positive / total) * 100) : 0,
            totalReviews: total,
            positiveOutcomes: positive,
            averageRatings: {
              effectiveness: avg.effectivenessAvg || 0,
              easeOfUse: avg.easeOfUseAvg || 0,
              sideEffects: avg.sideEffectsAvg || 0,
              overall: avg.overallAvg || 0,
            },
          };
          // Return remedy with ratings
          return {
            ...remedy.toObject(),
            ratings,
          };
        }
        // For non-AI remedies, just return the remedy as is
        return remedy.toObject();
      })
    );

    res.status(200).json({
      success: true,
      remedies:updatedRemedy,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch remedies by ailment ID",
      error: error.message,
    });
  }
};

const getAIfeedback = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: remedyId } = req.params;

    // Validate remedy ID
    if (!mongoose.Types.ObjectId.isValid(remedyId)) {
      return res.status(400).json({
        message: "Invalid remedy ID",
        success: false,
      });
    }

    const userProfile = await UserProfile.findOne({ userId });

    // Check if remedy exists and is active
    const remedy = await Remedy.findById(remedyId);
    if (!remedy || !remedy.isActive) {
      return res.status(404).json({
        message: "Remedy not found or inactive",
        success: false,
      });
    }

    // Check if feedback already exists for this remedy and user
    const existingFeedback = await AiFeedback.findOne({
      remedyId,
      userId,
    }).sort({ createdAt: -1 });

    // Check if existing feedback exists and profile version matches
    if (
      existingFeedback &&
      existingFeedback.profileVersion === userProfile.__v
    ) {
      return res.status(200).json({
        message: "AI feedback already exists",
        success: true,
        feedback: existingFeedback.feedbackText,
        feedbackData: existingFeedback,
      });
    }

    // Generate new AI feedback (either no existing feedback or profile version mismatch)
    const feedbackData = await generateAiFeedback(remedyId, userId);

    // Create new feedback record based on remedy type
    let newFeedback;

    if (remedy.type === "ai") {
      // For AI remedies, use the full structured feedback
      newFeedback = await AiFeedback.create({
        remedyId,
        userId,
        profileVersion: userProfile.__v,
        ...feedbackData,
      });
    } else {
      // For non-AI remedies, use simple text feedback
      newFeedback = await AiFeedback.create({
        remedyId,
        userId,
        profileVersion: userProfile.__v,
        feedbackText: feedbackData,
      });
    }

    return res.status(200).json({
      message: "AI feedback generated successfully",
      success: true,
      feedback: newFeedback.feedbackText,
      feedbackData: newFeedback,
    });
  } catch (error) {
    console.error("Error generating AI feedback:", error);

    // Handle specific error cases
    if (error.message === "User profile not found") {
      return res.status(404).json({
        message:
          "User profile not found. Please complete your health profile first.",
        success: false,
      });
    }

    if (error.message === "Remedy not found") {
      return res.status(404).json({
        message: "Remedy not found",
        success: false,
      });
    }

    if (error.message === "AI response did not contain valid JSON block") {
      return res.status(500).json({
        message: "Failed to generate AI feedback. Please try again later.",
        success: false,
      });
    }

    return res.status(500).json({
      message: "Failed to generate AI feedback",
      error: error.message,
      success: false,
    });
  }
};

const generateAIRemedy = async (req, res) => {
  try {
    const ailmentId = req.params.id;
    const userId = req.user.id;
    const symptoms = req.body.symptoms;

    // Generate remedy object using AI
    const remedyData = await generateRemedy(userId, ailmentId, symptoms);

    // Save the generated remedy to the database
    const newRemedy = await Remedy.create(remedyData);

    res.status(201).json({
      message: "AI-generated remedy created successfully.",
      success: true,
      remedy: newRemedy,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to generate AI remedy.",
      success: false,
    });
  }
};

export {
  flagRemedy,
  getAllCommentsByRemedyId,
  createRemedy,
  getAIfeedback,
  getAllRemedies,
  createComment,
  getRemedyById,
  updateRemedy,
  deleteRemedy,
  getRemediesByAilmentId,
  generateAIRemedy,
};
