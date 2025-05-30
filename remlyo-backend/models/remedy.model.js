import mongoose from "mongoose";

// Define category enum as a constant for maintainability and clarity
export const REMEDY_CATEGORIES = [
  "Community Remedies",
  "Pain Relief",
  "Digestive",
  "Respiratory",
  "Immune Support",
  "Sleep Aid",
  "Skin Care",
];
const REMEDY_TYPES = ["pharmaceutical", "alternative", "community"];
const RemedySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: REMEDY_CATEGORIES, // reference the constant here
      required: true,
    },
    ingredients: {
      type: [String],
    },
    preparationMethod: {
      type: String,
    },
    usageInstructions: {
      type: String,
    },
    sideEffects: {
      type: [String],
      default: [],
    },
    aiConfidenceScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isAIGenerated: {
      type: Boolean,
      default: false,
    },
    moderationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"], // maybe update this in future
      default: "pending",
    },
    scientificReferences: {
      type: [String],
      default: [],
    },
    geographicRestrictions: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      enum: REMEDY_TYPES,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Remedy = mongoose.model("Remedy", RemedySchema);
export default Remedy;
