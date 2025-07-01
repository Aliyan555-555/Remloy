import mongoose from "mongoose";

const AiFeedbackSchema = new mongoose.Schema(
  {
    remedyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Remedy",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ User Feedback on Effectiveness
    usefulness: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedbackText: {
      type: String,
    },
    improvedCondition: {
      type: Boolean,
      default: false,
    },

    // ✅ Summary Section (Confidence + Why Recommended)
    aiSummary: {
      confidenceScore: { type: Number, min: 0, max: 100 }, // e.g. 95
      confidenceExplanation: { type: String }, // "95% confidence in the effectiveness..."
      recommendationReason: { type: String }, // Full paragraph
    },

    // ✅ Advanced Insight Section
    advanceAiInsights: {
      title: { type: String }, // e.g. "Your Remedy Insights"
      description: { type: String }, // e.g. "Based on 7,412 users with similar profiles"
      healthMatchScore: { type: Number, min: 0, max: 100 }, // e.g. 93
      matchedFactors: {
        ageRange: { type: String }, // e.g. "35–40 years"
        diet: { type: String }, // e.g. "High processed food"
        stressLevel: { type: String }, // e.g. "High"
        sleepPattern: { type: String }, // e.g. "5–6 hours"
        previousRemedySuccess: { type: String }, // e.g. "Low with pharma"
      },
      aiConfidenceRating: {
        score: { type: Number, min: 0, max: 100 }, // e.g. 95
        basedOnUsers: { type: Number }, // e.g. 7412
      },
      selectedReasons: [
        { type: String }, // e.g. "You reported throbbing pain"
      ],
      similarUserOutcomes: [
        {
          improvement: { type: String }, // e.g. "better sleep"
          percentage: { type: Number }, // e.g. 83
        },
      ],
      aiLearningLog: {
        lastUpdated: { type: Date }, // e.g. "2025-03-18"
        newRatings: { type: Number }, // e.g. 892
        insights: [{ type: String }], // e.g. "More effective for users over 40"
      },
      remedyAdjustmentNotice: {
        message: { type: String }, // e.g. "Your remedy may continue to evolve..."
        active: { type: Boolean, default: true },
      },
    },

    disclaimerShown: {
      type: Boolean,
      default: true,
    },
    profileVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Searchable index for free-text feedback
AiFeedbackSchema.index({ feedbackText: "text" });

const AiFeedback = mongoose.model("AiFeedback", AiFeedbackSchema);
export default AiFeedback;
