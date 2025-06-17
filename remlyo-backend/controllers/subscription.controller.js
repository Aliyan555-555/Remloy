import UserSubscription from "../models/user_subscription.js";
import PricingPlan from "../models/pricing_plan.model.js";
import User from "../models/user.model.js";

// Create a new subscription
const createSubscription = async (req, res) => {
  try {
    const { userId, planId, paymentMethod, billingPeriod } = req.body;

    // Validate required fields
    if (!userId || !planId || !paymentMethod || !billingPeriod) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check if plan exists
    const plan = await PricingPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: "Pricing plan not found",
      });
    }

    // Check for existing active subscription
    const existingSubscription = await UserSubscription.findOne({
      userId,
      startDate: Date.now(),
      status: "active",
    });

    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        error: "User already has an active subscription",
      });
    }

    // Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date();
    if (billingPeriod === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (billingPeriod === "annually") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Create subscription
    const subscription = await UserSubscription.create({
      userId,
      planId,
      paymentMethod,
      billingPeriod,
      startDate,
      endDate,
      status: "active",
      price: plan.price,
      originalPrice: plan.originalPrice,
      discountPercentage: plan.discountPercentage,
    });

    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get active subscription
const getActiveSubscription = async (req, res) => {
  try {
    const { userId } = req.params;

    const subscription = await UserSubscription.findOne({
      userId,
      status: "active",
    }).populate("planId");

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: "No active subscription found",
      });
    }

    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Cancel subscription
const cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await UserSubscription.findById(subscriptionId);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: "Subscription not found",
      });
    }

    if (subscription.status !== "active") {
      return res.status(400).json({
        success: false,
        error: "Subscription is not active",
      });
    }

    subscription.status = "cancelled";
    subscription.cancelledAt = new Date();
    await subscription.save();

    res.status(200).json({
      success: true,
      message: "Subscription cancelled successfully",
      data: subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update subscription
const updateSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { planId, billingPeriod, paymentMethod } = req.body;

    const subscription = await UserSubscription.findById(subscriptionId);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: "Subscription not found",
      });
    }

    // Update plan if provided
    if (planId) {
      const newPlan = await PricingPlan.findById(planId);
      if (!newPlan) {
        return res.status(404).json({
          success: false,
          error: "Pricing plan not found",
        });
      }

      subscription.planId = planId;
      subscription.price = newPlan.price;
      subscription.originalPrice = newPlan.originalPrice;
      subscription.discountPercentage = newPlan.discountPercentage;
    }

    // Update other fields if provided
    if (billingPeriod) subscription.billingPeriod = billingPeriod;
    if (paymentMethod) subscription.paymentMethod = paymentMethod;

    // Recalculate end date if billing period changed
    if (billingPeriod) {
      const startDate = subscription.startDate;
      const endDate = new Date(startDate);
      if (billingPeriod === "monthly") {
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (billingPeriod === "annually") {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }
      subscription.endDate = endDate;
    }

    await subscription.save();

    res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      data: subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get subscription history
const getSubscriptionHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const subscriptions = await UserSubscription.find({ userId })
      .populate("planId")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await UserSubscription.countDocuments({ userId });

    res.status(200).json({
      success: true,
      data: {
        subscriptions,
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

// Check subscription status
const checkSubscriptionStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const subscription = await UserSubscription.findOne({
      userId,
      status: "active",
      endDate: { $gt: new Date() },
    }).populate("planId");

    res.status(200).json({
      success: true,
      data: {
        hasActiveSubscription: !!subscription,
        subscription,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export {
  createSubscription,
  getActiveSubscription,
  cancelSubscription,
  updateSubscription,
  getSubscriptionHistory,
  checkSubscriptionStatus,
};
