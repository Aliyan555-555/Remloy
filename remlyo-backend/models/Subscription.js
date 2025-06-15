const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['free', 'premium', 'pay-per-remedy']
  },
  features: [{
    type: String,
    required: true
  }],
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: Number, // in days, 0 for lifetime
    default: 30
  },
  maxRemediesPerAilment: {
    type: Number,
    default: 3 // for free plan
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const userSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionPlan',
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  paymentHistory: [{
    amount: Number,
    date: Date,
    transactionId: String
  }],
  remedyAccess: [{
    ailmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ailment'
    },
    accessedRemedies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Remedy'
    }],
    accessCount: {
      type: Number,
      default: 0
    }
  }]
});

const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
const UserSubscription = mongoose.model('UserSubscription', userSubscriptionSchema);

module.exports = {
  SubscriptionPlan,
  UserSubscription
}; 