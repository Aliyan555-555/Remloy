const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const auth = require('../middleware/auth');

// Initialize subscription plans (admin only)
router.post('/initialize', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  await subscriptionController.initializeSubscriptionPlans();
  res.json({ message: 'Subscription plans initialized successfully' });
});

// Get all subscription plans
router.get('/plans', subscriptionController.getSubscriptionPlans);

// Subscribe to a plan
router.post('/subscribe', auth, subscriptionController.subscribeToPlan);

// Get current subscription
router.get('/current', auth, subscriptionController.getCurrentSubscription);

// Cancel subscription
router.post('/cancel', auth, subscriptionController.cancelSubscription);

// Check remedy access
router.get('/check-access/:ailmentId/:remedyId', auth, subscriptionController.checkRemedyAccess);

module.exports = router; 