import UserSubscription from "../models/user_subscription.js";
import PricingPlan from "../models/pricing_plan.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import stripe from "./../config/stripe.config.js";
import PaymentHistory from "./../models/payment_history.model.js";
import PaymentMethod from "./../models/payment_method.model.js";
import PDFDocument from "pdfkit";
import getStream from "get-stream";

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
      endDate: { $gt: new Date() },
    }).populate("plan", "name type price");

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

// Unified subscription handler for both free and paid plans
const subscribePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const paymentIntent = req.body; // For paid plans
    const userId = req.user.id;
    const force = Boolean(req.query.force);

    // Find the plan
    const plan = await PricingPlan.findById(id);
    if (!plan) {
      return res.status(404).json({ success: false, error: "Plan not found" });
    }

    // Check if user already has an active subscription to this plan
    const existing = await UserSubscription.findOne({
      userId,
      plan: id,
      endDate: { $gt: new Date() },
      canceledAt: { $exists: false },
    });
    if (!force && existing) {
      return res.status(400).json({
        success: false,
        confirmation: true,
        error: "User already has an active subscription to this plan",
      });
    }

    // Set subscription dates
    const startDate = new Date();
    const endDate = new Date();
    let duration = 30;
    if (plan.type === "month") {
      endDate.setMonth(endDate.getMonth() + 1);
      duration = 30;
    } else {
      endDate.setMonth(endDate.getMonth() + 12);
      // Leap year check for annual
      duration =
        new Date(new Date().getFullYear(), 1, 29).getDate() === 29 ? 366 : 365;
    }

    // Free plan logic
    if (plan.price === 0 && plan.originalPrice === 0) {
      const subscription = await UserSubscription.create({
        userId,
        plan: plan._id,
        startDate,
        endDate,
        autoRenew: false,
        paymentStatus: "completed",
        features: plan.features,
        monthlyPrice: 0,
        billingCycle: plan.type,
        nextBillingDate: endDate,
        duration,
      });
      await User.findByIdAndUpdate(userId, {
        activeSubscription: subscription._id,
      });
      return res.status(201).json({
        success: true,
        message: "Subscribed to Free plan successfully",
        data: subscription,
        status: "completed",
      });
    }

    // Paid plan logic
    // Validate paymentIntentId (should be provided for paid plans)
    if (!paymentIntent) {
      return res.status(400).json({
        success: false,
        error: "Payment information is required for paid plans",
      });
    }
    const paymentMethodId = paymentIntent.payment_method;
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    const subscription = await UserSubscription.create({
      userId,
      plan: plan._id,
      startDate,
      endDate,
      autoRenew: true,
      paymentStatus: "completed",
      features: plan.features,
      monthlyPrice: plan.price,
      billingCycle: plan.type,
      nextBillingDate: endDate,
      duration,
    });
    await User.findByIdAndUpdate(userId, {
      activeSubscription: subscription._id,
    });

    await PaymentHistory.create({
      userId,
      subscriptionId: subscription._id,
      amount: plan.price,
      currency: plan.currency,
      transactionId: paymentMethodId,
      status: "completed",
    });
    return res.status(201).json({
      success: true,
      message: "Subscribed to paid plan successfully",
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
    const redirectUrl = `/checkout/${planId}`;
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
    }).populate("plan", "name price type");

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

const generateRecipe = async (req, res) => {
  const { id } = req.params;

  const subscription = await UserSubscription.findById(id).populate([
    {
      path: "userId",
    },
    {
      path: "plan",
    },
  ]);

  if (!subscription) {
    return res.status(404).json({
      message: "Subscription not found",
      success: false,
    });
  }

  const doc = new PDFDocument({ margin: 50 });
  const chunks = [];

  doc.on("data", (chunk) => chunks.push(chunk));
  doc.on("end", () => {
    const result = Buffer.concat(chunks);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=subscription_receipt.pdf"
    );
    res.send(result);
  });

  // Styling Constants
  const sectionPadding = 12;
  const sectionWidth = doc.page.width - 2 * doc.options.margin;
  const boxRadius = 6;

  // Helper to draw rounded rectangles (pdfkit doesn't support directly)
  const drawRoundedRect = (x, y, width, height, radius, fillColor) => {
    doc.save();
    doc.roundedRect(x, y, width, height, radius).fill(fillColor);
    doc.restore();
  };

  const sectionTitle = (title) => {
    const y = doc.y;
    drawRoundedRect(doc.x, y, sectionWidth, 26, boxRadius, "#2F6A50");
    doc
      .fillColor("#ffffff")
      .font("Helvetica-Bold")
      .fontSize(13)
      .text(`  ${title}`, doc.x + 5, y + 7);
    doc.moveDown(1);
  };

  const field = (label, value) => {
    doc
      .fillColor("black")
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(`${label}: `, { continued: true })
      .font("Helvetica")
      .text(value)
      .moveDown(0.5);
  };

  const bulletList = (items) => {
    items.forEach((item) => {
      doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor("gray")
        .text(`• ${item}`, { indent: 20 });
    });
    doc.moveDown(0.5);
  };

  // Format dates
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  // PDF Background and Header
  doc.rect(0, 0, doc.page.width, doc.page.height).fill("#F2F4F3");
  doc
    .fillColor("#2F6A50")
    .font("Helvetica-Bold")
    .fontSize(22)
    .text("Subscription Receipt", { align: "center" });
  doc.moveDown(1.5);

  // Receipt Info Section
  sectionTitle("Receipt Information");
  field("Start date", formatDate(subscription.startDate));
  field("End date", formatDate(subscription.endDate));
  field("Status", subscription.status);
  doc.moveDown(1);

  // Subscriber Info
  sectionTitle("Subscriber Information");
  field("Plan Name", subscription.plan.name);
  field("Plan Type", subscription.plan.type);
  field("Billing Cycle", subscription.plan.billingCycle);
  field("Currency", subscription.plan.currency);
  doc.moveDown(1);

  // Payment Summary
  sectionTitle("Payment Summary");
  field("Base Price", `$${subscription.plan.price}`);
  field("Discount", `$${subscription.plan.discountPercentage}`);
  field("Total Paid", `$${subscription.plan.price}`);
  doc.moveDown(1);

  // Features
  sectionTitle("Plan Features");
  bulletList(subscription.features);
  doc.moveDown(1.5);

  // Footer
  doc
    .font("Helvetica-Oblique")
    .fillColor("black")
    .fontSize(11)
    .text("For questions or support, contact us:");
  doc
    .fillColor("blue")
    .text("support@remlyo.com", { link: "mailto:support@remlyo.com" });
  doc.text("www.remlyo.com", { link: "http://www.remlyo.com" });

  doc.end();
};

export {
  generateRecipe,
  subscribePlan,
  preSubscriptionStep,
  createSubscription,
  getActiveSubscription,
  cancelSubscription,
  updateSubscription,
  getSubscriptionHistory,
  checkSubscriptionStatus,
  checkInSuccess,
};
