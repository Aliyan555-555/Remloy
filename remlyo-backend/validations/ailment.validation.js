import Joi from "joi";
import { AilmentCategories } from "./../constants/index.js";

const ailmentValidationSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  category: Joi.string()
    .valid(...AilmentCategories)
    .required(),
  symptoms: Joi.array().items(Joi.string()).min(1).required(),
  causesAndRisks: Joi.array().items(Joi.string()).optional(),
  preventionTips: Joi.array().items(Joi.string()).optional(),
  recommendedRemedies: Joi.array()
    .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
    .optional(),
  relatedAilments: Joi.array()
    .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
    .optional(),
  severity: Joi.string().valid("mild", "moderate", "severe").optional(),
  isContagious: Joi.boolean().optional(),
  requiresMedicalAttention: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  slug: Joi.string().required(),
  isCommon: Joi.boolean().optional(),
});

export default ailmentValidationSchema;
