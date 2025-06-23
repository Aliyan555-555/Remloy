import mongoose from "mongoose";
import { AilmentCategories } from "../constants/index.js";

const AilmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3, // Minimum length for the ailment name
      maxlength: 100, // Maximum length for the ailment name
    },
    slug:{
      type:String,
      unique:true,
      required:true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: AilmentCategories,
      required: true,
    },
    symptoms: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => v.length > 0,
        message: "At least one symptom is required.",
      },
    },
    causesAndRisks: {
      type: [String],
      default: [],
    },
    preventionTips: {
      type: [String],
      default: [],
    },
    recommendedRemedies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Remedy",
      },
    ],
    relatedAilments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ailment",
      },
    ],
    severity: {
      type: String,
      enum: ["mild", "moderate", "severe"], // Example severity levels
    },
    isCommon:{
      type:Boolean,
      default:false,
    },
    isContagious: {
      type: Boolean,
      default: false,
    },
    requiresMedicalAttention: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

AilmentSchema.index({ name: "text", description: "text" });

const Ailment = mongoose.model("Ailment", AilmentSchema);
export default Ailment;
