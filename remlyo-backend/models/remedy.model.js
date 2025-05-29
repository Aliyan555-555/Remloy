import mongoose from 'mongoose';

const RemedySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['herbal', 'homeopathic', 'traditional', 'other'], // maybe update this in future
    required: true,
  },
  ingredients: {
    type: [String],
    default: [],
  },
  preparationMethod: {
    type: String,
    required: true,
  },
  usageInstructions: {
    type: String,
    required: true,
  },
  sideEffects: {
    type: [String],
    default: [],
  },
  aiConfidenceScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  isAIGenerated: {
    type: Boolean,
    default: false,
  },
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],// maybe update this in future
    default: 'pending',
  },
  scientificReferences: {
    type: [String],
    default: [],
  },
  geographicRestrictions: {
    type: [String],
    default: [],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  isActive:{
    type:Boolean,
    default:true
  }
}, { timestamps: true });

RemedySchema.index({ name: 'text', description: 'text', category: 'text' });

const Remedy = mongoose.model('Remedy', RemedySchema);
export default Remedy;
