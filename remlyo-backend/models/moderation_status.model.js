import mongoose from "mongoose";

const ModerationStatusSchema = new mongoose.Schema(
  {
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    contentType: {
      type: String,
      enum: ["Remedy", "Review", "AiFeedback"], // maybe update this in future
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"], // maybe update this in future
      default: "pending",
    },
    moderatorNotes: {
      type: String,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewDate: {
      type: Date,
      default: Date.now,
    },
    moderationHistory: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reason: { type: String },
        note: { type: String },
        flaggedAt: { type: Date, default: Date.now },
      },
    ],
    flagCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    rejectionReason: {
      type: String,
      maxlength: 500,
    },
    
  },
  { timestamps: true }
);

const ModerationStatus = mongoose.model(
  "ModerationStatus",
  ModerationStatusSchema
);
export default ModerationStatus;
