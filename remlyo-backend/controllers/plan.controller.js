import PricingPlan from "../models/pricing_plan.model.js";
import UserSubscription from "../models/user_subscription.js";

// Get all plans
const getAllPlans = async (req, res) => {
  try {
    const plans = await PricingPlan.find();
    let isFreePlanUsed = null;
    if (req.user && req.user.id) {
      // Find the Free plan
      const freePlan = await PricingPlan.findOne({
        originalPrice: 0,
        price: 0,
      });
      if (freePlan) {
        // Check if user has ever had a subscription to the Free plan
        const used = await UserSubscription.findOne({
          userId: req.user.id,
          plan: freePlan._id,
        });
        isFreePlanUsed = !!used;
      }
    }
    res.status(200).json({
      success: true,
      message: "Successfully fetched all plans",
      plans,
      user: {
        isFreePlanUsed,
      },
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

// Subscribe to Free Plan

export { getAllPlans, getPlan};
