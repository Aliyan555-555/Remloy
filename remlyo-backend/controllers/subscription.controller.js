import UserSubscription from "../models/user_subscription.js";
import PricingPlan from "../models/pricing_plan.model.js";
import User from "../models/user.model.js";

// Create a new subscription
const createSubscription = async (req, res) => {
  try {
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
    const userId = req.user.id;

    if (!userId) {
      return res.status(404).json({
        message: "User is required",
        success: false,
      });
    }

    const subscription = await UserSubscription.findOne({
      userId,
      status: "active",
      endDate: { $gt: new Date() },
    }).populate("planId");

    res.status(200).json({
      success: true,
      message: "subscription is valid",
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

const subscribeFreePlan = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    // Find the Free plan
    const freePlan = await PricingPlan.findById(id);
    if (!freePlan) {
      return res
        .status(404)
        .json({ success: false, error: "Free plan not found" });
    }
    // Check if user already has a free plan subscription
    const existing = await UserSubscription.findOne({
      userId: req.user.id,
      plan: id,
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: "User already subscribed to Free plan",
      });
    }
    // Set subscription dates (1 month by default for free plan)
    const startDate = new Date();
    const endDate = new Date();
    if (freePlan.type === "month") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 12);
    }
    // Create subscription
    const subscription = await UserSubscription.create({
      userId: req.user.id,
      plan: freePlan._id,
      startDate,
      endDate,
      autoRenew: false,
      paymentStatus: "completed",
      features: freePlan.features,
      monthlyPrice: 0,
      billingCycle: freePlan.type,
      nextBillingDate: endDate,
      duration:
        freePlan.type === "month"
          ? 30
          : new Date(new Date().getFullYear(), 1, 29).getDate() === 29
          ? 366
          : 365,
    });
    await User.findByIdAndUpdate(req.user.id, {
      activeSubscription: subscription._id,
    });
    res.status(201).json({
      success: true,
      message: "Subscribed to Free plan successfully",
      data: subscription,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const preSubscriptionStep = async (req, res) => {
  try {
    const user = req.user;
    const planId = req.params.id;
    if (!user || !user.id) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    // Find the plan
    const plan = await PricingPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ success: false, error: "Plan not found" });
    }
    // Check if plan is free
    const isFreePlan = plan.price === 0 && plan.originalPrice === 0;
    // Check if user has an active subscription to this plan
    const now = new Date();
    const activePlanData = await UserSubscription.findOne({
      userId: user.id,
      plan: planId,
      endDate: { $gt: now },
      canceledAt: { $exists: false },
    });
    const isPlanActive = !!activePlanData;
    // Build redirect URL
    const redirectUrl = `/subscription/checkout/${planId}`;
    res.status(200).json({
      success: true,
      redirectUrl,
      isFreePlan,
      isPlanActive,
      activePlanData,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const checkInSuccess = async (req, res) => {
  try {
    const { id: planId } = req.params;
    const { id: userId } = req.user;

    const now = new Date();
    const activeSubscription = await UserSubscription.findOne({
      userId,
      plan: planId,
      endDate: { $gt: now },
      canceledAt: { $exists: false },
      paymentStatus: "completed",
    });

    return res.status(200).json({
      success: true,
      data: {
        isSubscribed: !!activeSubscription,
        subscription: activeSubscription || null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export {
  subscribeFreePlan,
  preSubscriptionStep,
  createSubscription,
  getActiveSubscription,
  cancelSubscription,
  updateSubscription,
  getSubscriptionHistory,
  checkSubscriptionStatus,
  checkInSuccess,
};
