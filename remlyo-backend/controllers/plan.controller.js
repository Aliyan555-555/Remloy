import mongoose from "mongoose";
import PricingPlan from "../models/pricing_plan.model.js";
import UserSubscription from "../models/user_subscription.js";

// Get all plans
const getAllPlans = async (req, res) => {
  try {
    const plans = await PricingPlan.find({ isActive: true }).sort({ price: 1 });
    
    let userSubscriptionInfo = null;
    
    if (req.user && req.user.id) {
      // Get all free plans
      const freePlans = plans.filter(plan => plan.price === 0);
      
      // Get all paid plans
      const paidPlans = plans.filter(plan => plan.price > 0);
      
      // Check user's current active subscription
      const currentSubscription = await UserSubscription.findOne({
        userId: req.user.id,
        // status: "active",
        // endDate: { $gte: new Date() }
      }).populate('plan');
      
      // Check if user has ever used any free plan
      const hasUsedFreePlan = await UserSubscription.exists({
        userId: req.user.id,
        plan: { $in: freePlans.map(plan => new mongoose.Types.ObjectId(plan._id)) }
      });
      
      // Get user's subscription history for all plans
      const subscriptionHistory = await UserSubscription.find({
        userId: req.user.id
      }).populate('plan');
      
      userSubscriptionInfo = {
        currentSubscription: currentSubscription ? {
          planId: currentSubscription.plan._id,
          planName: currentSubscription.plan.name,
          status: currentSubscription.status,
          endDate: currentSubscription.endDate,
          autoRenew: currentSubscription.autoRenew,
          nextBillingDate: currentSubscription.nextBillingDate
        } : null,
        hasUsedFreePlan: !!hasUsedFreePlan,
        subscriptionHistory: subscriptionHistory.map(sub => ({
          planId: sub.plan._id,
          planName: sub.plan.name,
          status: sub.status,
          startDate: sub.startDate,
          endDate: sub.endDate,
          paymentStatus: sub.paymentStatus
        })),
        // Plan-specific usage info
        planUsage: plans.map(plan => ({
          planId: plan._id,
          planName: plan.name,
          isFree: plan.price === 0,
          hasUsed: subscriptionHistory.some(sub => 
            sub.plan._id.toString() === plan._id.toString()
          ),
          isCurrentlySubscribed: currentSubscription && 
            currentSubscription.plan._id.toString() === plan._id.toString()
        }))
      };
    }
    
    res.status(200).json({
      success: true,
      message: "Successfully fetched all plans",
      plans,
      user: userSubscriptionInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Get single plan
const getPlan = async (req, res) => {
  try {
    const plan = await PricingPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: "Plan not found",
      });
    }
    res.status(200).json({
      success: true,
      plan: plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get plan statistics (for admin use)
const getPlanStats = async (req, res) => {
  try {
    const plans = await PricingPlan.find({ isActive: true });
    
    const stats = await Promise.all(plans.map(async (plan) => {
      const subscriptionCount = await UserSubscription.countDocuments({
        plan: plan._id,
        status: "active"
      });
      
      const totalSubscriptions = await UserSubscription.countDocuments({
        plan: plan._id
      });
      
      return {
        planId: plan._id,
        planName: plan.name,
        price: plan.price,
        activeSubscriptions: subscriptionCount,
        totalSubscriptions: totalSubscriptions,
        revenue: subscriptionCount * plan.price
      };
    }));
    
    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Check if user can subscribe to a specific plan
const checkPlanEligibility = async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user.id;
    
    const plan = await PricingPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: "Plan not found"
      });
    }
    
    const currentSubscription = await UserSubscription.findOne({
      userId,
      status: "active",
      endDate: { $gte: new Date() }
    });
    
    // Check if plan is free and user has already used a free plan
    let canSubscribe = true;
    let reason = null;
    
    if (plan.price === 0) {
      const hasUsedFreePlan = await UserSubscription.exists({
        userId,
        plan: { $in: await PricingPlan.find({ price: 0 }).distinct('_id') }
      });
      
      if (hasUsedFreePlan) {
        canSubscribe = false;
        reason = "You have already used a free plan";
      }
    }
    
    // Check if user is already subscribed to this plan
    if (currentSubscription && currentSubscription.plan.toString() === planId) {
      canSubscribe = false;
      reason = "You are already subscribed to this plan";
    }
    
    res.status(200).json({
      success: true,
      canSubscribe,
      reason,
      currentPlan: currentSubscription ? {
        planId: currentSubscription.plan,
        status: currentSubscription.status,
        endDate: currentSubscription.endDate
      } : null,
      targetPlan: {
        planId: plan._id,
        name: plan.name,
        price: plan.price,
        features: plan.features
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Subscribe to Free Plan

export { getAllPlans, getPlan, getPlanStats, checkPlanEligibility };
