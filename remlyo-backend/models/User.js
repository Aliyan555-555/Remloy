const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // ... existing code ...
  
  role: {
    type: String,
    enum: ['user', 'admin', 'writer', 'moderator'],
    default: 'user'
  },
  subscriptionStatus: {
    type: String,
    enum: ['none', 'active', 'cancelled', 'expired'],
    default: 'none'
  },
  currentPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionPlan'
  },
  subscriptionHistory: [{
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubscriptionPlan'
    },
    startDate: Date,
    endDate: Date,
    status: String
  }],
  // ... existing code ...
});

module.exports = mongoose.model('User', userSchema); 