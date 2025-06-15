const { UserSubscription } = require('../models/Subscription');

const checkSubscription = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { ailmentId, remedyId } = req.params;

    const subscription = await UserSubscription.findOne({
      userId,
      status: 'active'
    }).populate('planId');

    if (!subscription) {
      return res.status(403).json({
        message: 'No active subscription found',
        required: 'subscription'
      });
    }

    // Premium users have unlimited access
    if (subscription.planId.name === 'premium') {
      return next();
    }

    const remedyAccess = subscription.remedyAccess.find(
      access => access.ailmentId.toString() === ailmentId
    );

    // Free plan: Check remedy count per ailment
    if (subscription.planId.name === 'free') {
      if (!remedyAccess || remedyAccess.accessCount < subscription.planId.maxRemediesPerAilment) {
        return next();
      }
      return res.status(403).json({
        message: 'Free plan limit reached for this ailment',
        required: 'upgrade'
      });
    }

    // Pay-per-remedy plan: Check if remedy is purchased
    if (subscription.planId.name === 'pay-per-remedy') {
      if (remedyAccess && remedyAccess.accessedRemedies.includes(remedyId)) {
        return next();
      }
      return res.status(403).json({
        message: 'Remedy not purchased',
        required: 'purchase'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking subscription', error: error.message });
  }
};

module.exports = checkSubscription; 