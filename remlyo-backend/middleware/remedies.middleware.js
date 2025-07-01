import User from "../models/user.model.js";
import PricingPlan from "./../models/pricing_plan.model.js";
import Remedy from "../models/remedy.model.js";
import UserSubscription from "../models/user_subscription.js";

// Helper: check if remedy is unlocked for user
const isRemedyUnlocked = (userData, remedyId) => userData.unlockedRemedies.map(r => r.toString()).includes(remedyId);

// Helper: unlock remedy for user
const unlockRemedyForUser = async (userData, remedyId) => {
  if (!isRemedyUnlocked(userData, remedyId)) {
    userData.unlockedRemedies.push(remedyId);
    await userData.save();
  }
};

// Helper: add remedy to ailment access
const addRemedyToAilmentAccess = (subscriptionData, ailmentId, remedyId, maxRemedies) => {
  let ailmentAccess = subscriptionData.accessRemediesWithAilments.find(
    (a) => a.ailmentId.toString() === ailmentId.toString()
  );
  if (ailmentAccess) {
    if (!ailmentAccess.remedies.map(r => r.toString()).includes(remedyId)) {
      if (maxRemedies == 0) {
        ailmentAccess.remedies.push(remedyId);
        return { added: true };
      }
      if (ailmentAccess.remedies.length < maxRemedies) {
        ailmentAccess.remedies.push(remedyId);
        return { added: true };
      } else {
        return { limitReached: true };
      }
    }
    return { alreadyExists: true };
  } else {
    subscriptionData.accessRemediesWithAilments.push({
      ailmentId,
      remedies: [remedyId],
    });
    return { added: true };
  }
};

const remedyAccessMiddleware = async (req, res, next) => {
  try {
    const subscription = req.subscription;
    const user = req.user;
    const remedyId = req.params.id;
    const ailmentId = req.query.id;

    if (!subscription || !user) {
      return res.status(401).json({ message: "Unauthorized: Missing user or subscription.", success: false });
    }

    const userData = await User.findById(user.id);
    if (!userData) {
      return res.status(404).json({ message: "User not found.", success: false });
    }
    const plan = await PricingPlan.findById(subscription.plan);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found.", success: false });
    }
    const subscriptionData = await UserSubscription.findById(subscription._id);
    if (!subscriptionData) {
      return res.status(404).json({ message: "Subscription not found.", success: false });
    }
    const remedy = await Remedy.findById(remedyId);
    if (!remedy) {
      return res.status(404).json({ message: "Remedy not found.", success: false });
    }

    // 1. Always allow if user has unlocked this remedy
    if (isRemedyUnlocked(userData, remedyId)) {
      return next();
    }

    // 2. Always allow if plan is unlimited
    if (plan.isUnlimitedRemedies) {
      await unlockRemedyForUser(userData, remedyId);
      if (remedy && Array.isArray(remedy.ailments)) {
        for (const remedyAilmentId of remedy.ailments) {
          addRemedyToAilmentAccess(subscriptionData, remedyAilmentId, remedyId);
        }
        await subscriptionData.save();
      }
      return next();
    }

    // 3. Ailment-based access
    if (ailmentId) {
      const maxRemedies = plan.remediesPerAilment;
      let ailmentAccess = subscriptionData.accessRemediesWithAilments.find(
        (a) => a.ailmentId.toString() === ailmentId
      );
      if (
        ailmentAccess &&
        ailmentAccess.remedies.map((r) => r.toString()).includes(remedyId)
      ) {
        return next();
      } else if (
        ailmentAccess &&
        ailmentAccess.remedies.length < maxRemedies
      ) {
        if (!ailmentAccess.remedies.map((r) => r.toString()).includes(remedyId)) {
          ailmentAccess.remedies.push(remedyId);
          await subscriptionData.save();
        }
        await unlockRemedyForUser(userData, remedyId);
        return next();
      } else if (!ailmentAccess && maxRemedies > 0) {
        subscriptionData.accessRemediesWithAilments.push({
          ailmentId,
          remedies: [remedyId],
        });
        await subscriptionData.save();
        await unlockRemedyForUser(userData, remedyId);
        return next();
      } else {
        return res.status(403).json({
          message: "Access denied: You have reached your plan's limit for this ailment.",
          success: false,
        });
      }
    }

    // 4. No ailmentId provided: check all remedy ailments
    if (remedy && Array.isArray(remedy.ailments)) {
      const maxRemedies = plan.remediesPerAilment;
      for (const remedyAilmentId of remedy.ailments) {
        const result = addRemedyToAilmentAccess(subscriptionData, remedyAilmentId, remedyId, maxRemedies);
        if (result.limitReached) {
          return res.status(403).json({
            message: "Access denied: You have reached your plan's limit for this ailment.",
            success: false,
            result,
            redirect: "/pricing",
          });
        }
      }
      await subscriptionData.save();
    }
    await unlockRemedyForUser(userData, remedyId);
    return next();
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error while checking remedy access.",
      error: error.message,
      success: false,
    });
  }
};

export default remedyAccessMiddleware;
