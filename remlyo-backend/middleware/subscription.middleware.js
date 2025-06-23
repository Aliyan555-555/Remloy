import UserSubscription from '../models/user_subscription.js';
import mongoose from 'mongoose';

const subscriptionMiddleware = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ message: 'Unauthorized: Invalid user.' });
    }

    const now = new Date();
    const subscription = await UserSubscription.findOne({
      userId,
      paymentStatus: 'completed',
      endDate: { $gte: now },
      canceledAt: { $exists: false },
    });

    if (!subscription) {
      return res.status(403).json({ message: 'Access denied. No active subscription.' });
    }

    req.subscription = subscription;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Subscription check failed.', error: error.message });
  }
};

export default subscriptionMiddleware; 