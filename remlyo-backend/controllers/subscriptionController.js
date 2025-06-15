const { SubscriptionPlan, UserSubscription } = require('../models/Subscription');
const User = require('../models/User');

// Initialize default subscription plans
const initializeSubscriptionPlans = async () => {
  try {
    const plans = [
      {
        name: 'free',
        features: [
          'Access 3 Remedies per Ailment',
          'Rate & Review Remedies',
          'Save Favorite Remedies'
        ],
        price: 0,
        duration: 0, // lifetime
        maxRemediesPerAilment: 3
      },
      {
        name: 'premium',
        features: [
          'Unlimited Remedy Access',
          'AI-Generated Remedy Recommendations',
          'Success Rate & AI Confidence Scores',
          'Priority Support',
          'Save Favorite Remedies',
          'Personalized AI Insights'
        ],
        price: 29.99,
        duration: 30
      },
      {
        name: 'pay-per-remedy',
        features: [
          'Select an ailment, and unlock access to its top remedies',
          'Access 5 remedies for your selected ailment',
          'One-time purchase'
        ],
        price: 9.99,
        duration: 0 // one-time purchase
      }
    ];

    for (const plan of plans) {
      await SubscriptionPlan.findOneAndUpdate(
        { name: plan.name },
        plan,
        { upsert: true, new: true }
      );
    }
  } catch (error) {
    console.error('Error initializing subscription plans:', error);
  }
};

// Get all subscription plans
const getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ isActive: true });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscription plans', error: error.message });
  }
};

// Subscribe to a plan
const subscribeToPlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user._id;

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }

    // Calculate end date
    const endDate = plan.duration === 0 
      ? new Date('2100-12-31') // Lifetime subscription
      : new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000);

    const subscription = new UserSubscription({
      userId,
      planId,
      endDate,
      status: 'active'
    });

    await subscription.save();

    // Update user's subscription status
    await User.findByIdAndUpdate(userId, {
      subscriptionStatus: 'active',
      currentPlan: planId
    });

    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Error subscribing to plan', error: error.message });
  }
};

// Get user's current subscription
const getCurrentSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    const subscription = await UserSubscription.findOne({ 
      userId,
      status: 'active'
    }).populate('planId');

    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscription', error: error.message });
  }
};

// Cancel subscription
const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    const subscription = await UserSubscription.findOne({ 
      userId,
      status: 'active'
    });

    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    subscription.status = 'cancelled';
    await subscription.save();

    // Update user's subscription status
    await User.findByIdAndUpdate(userId, {
      subscriptionStatus: 'cancelled'
    });

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling subscription', error: error.message });
  }
};

// Check remedy access
const checkRemedyAccess = async (req, res) => {
  try {
    const { ailmentId, remedyId } = req.params;
    const userId = req.user._id;

    const subscription = await UserSubscription.findOne({ 
      userId,
      status: 'active'
    }).populate('planId');

    if (!subscription) {
      return res.status(403).json({ message: 'No active subscription' });
    }

    const remedyAccess = subscription.remedyAccess.find(
      access => access.ailmentId.toString() === ailmentId
    );

    if (subscription.planId.name === 'premium') {
      return res.json({ hasAccess: true });
    }

    if (subscription.planId.name === 'free') {
      if (!remedyAccess || remedyAccess.accessCount < subscription.planId.maxRemediesPerAilment) {
        return res.json({ hasAccess: true });
      }
    }

    if (subscription.planId.name === 'pay-per-remedy') {
      if (remedyAccess && remedyAccess.accessedRemedies.includes(remedyId)) {
        return res.json({ hasAccess: true });
      }
    }

    res.json({ hasAccess: false });
  } catch (error) {
    res.status(500).json({ message: 'Error checking remedy access', error: error.message });
  }
};

module.exports = {
  initializeSubscriptionPlans,
  getSubscriptionPlans,
  subscribeToPlan,
  getCurrentSubscription,
  cancelSubscription,
  checkRemedyAccess
}; 