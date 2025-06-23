import mongoose from "mongoose";

const UserSubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PricingPlan",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    autoRenew: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"], // maybe update this in future
      default: "pending",
    },
    features: {
      type: [String],
      default: [],
    },
    monthlyPrice: {
      type: Number,
      default: 0,
      required: true,
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "yearly"], // maybe update this in future
      required: true,
    },
    nextBillingDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      default: 0, // 0 for lifetime
    },
    status: {
      type: String,
      enum: ["active", "expired", "canceled"],
      default: "active"
    },
    accessRemediesWithAilments: [
      {
        ailmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Ailment" },
        remedies: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Remedy"
          }
        ]

      }
    ],
    canceledAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const UserSubscription = mongoose.model(
  "UserSubscription",
  UserSubscriptionSchema
);

export default UserSubscription;
