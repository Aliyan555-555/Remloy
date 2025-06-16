import PricingPlan from "../models/pricing_plan.model.js";

// Get all plans
const getAllPlans = async (req, res) => {
  try {
    const plans = await PricingPlan.find();
    res.status(200).json({
      success: true,
      message: "Successfully fetched all plans",
      plans,
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
      data: plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export { getAllPlans, getPlan };
