import Joi from "joi";
// maybe update this in future
const remedyValidation = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().min(10).required(),
  category: Joi.string()
    .required(),
  ingredients: Joi.array().items(Joi.string().trim()).default([]),
  preparationMethod: Joi.string().min(5).required(),
  usageInstructions: Joi.string().min(5).required(),
  sideEffects: Joi.array().items(Joi.string().trim()).default([]),
  aiConfidenceScore: Joi.number().min(0).max(100).default(0),
  isAIGenerated: Joi.boolean().default(false),
  moderationStatus: Joi.string()
    .valid("pending", "approved", "rejected")
    .default("pending"),
  scientificReferences: Joi.array().items(Joi.string().uri()).default([]),
  geographicRestrictions: Joi.array().items(Joi.string().trim()).default([]),
  createdBy: Joi.string(),
  viewCount: Joi.number().min(0).default(0),
  isActive:true,
  averageRating: Joi.number().min(0).max(5).default(0),
});


export { remedyValidation };
