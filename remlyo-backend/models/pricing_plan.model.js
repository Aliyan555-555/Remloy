import mongoose from "mongoose";
const pricingPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["Free", "Premium", "Per Remedy"],
    },
    type: {
      type: String,
      required: true,
      enum: ["monthly", "yearly", "one-time"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    currency: {
      type: String,
      default: "USD",
      enum: ["USD", "EUR", "GBP"],
    },
    billingCycle: {
      type: Number,
      default: 1, // Number of months/years for the billing cycle
    },

    features: [
      {
        type: String,
        required: true,
      },
    ],
    remediesPerAilment: {
      type: Number,
      default: 3, // Default for free plan
    },
    isUnlimitedRemedies: {
      type: Boolean,
      default: false,
    },
    hasAIRemedies: {
      type: Boolean,
      default: false,
    },

    hasPersonalizedInsights: {
      type: Boolean,
      default: false,
    },
    hasRatingSystem: {
      type: Boolean,
      default: true,
    },
    hasFavoriteSystem: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    isPopular: {
      type: Boolean,
      default: false, // To highlight popular plans
    },
    purchaseCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const PricingPlan = mongoose.model("PricingPlan", pricingPlanSchema);
export default PricingPlan;
