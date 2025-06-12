// validations/articleValidation.js
import Joi from "joi";
import mongoose from "mongoose";

const articleValidationSchema = Joi.object({
  title: Joi.string().trim().max(200).required(),

  slug: Joi.string().trim().lowercase().required(),

  content: Joi.string().required(),

  excerpt: Joi.string().max(300).allow(""),

  coverImage: Joi.object({
    url: Joi.string().uri().allow(""),
    alt: Joi.string().allow(""),
  }).default({ url: "", alt: "" }),

  category: Joi.string()
    .valid("health", "wellness", "remedy", "nutrition", "lifestyle", "other")
    .default("other"),

  tags: Joi.array().items(Joi.string().trim().lowercase()),

  author: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required(),

  status: Joi.string()
    .valid("draft", "review", "published", "archived")
    .default("draft"),

  moderationStatus: Joi.string()
    .valid("pending", "approved", "rejected")
    .default("pending"),

  rejectionReason: Joi.string().allow(""),

  seo: Joi.object({
    metaTitle: Joi.string().max(60).allow(""),
    metaDescription: Joi.string().max(160).allow(""),
    keywords: Joi.array().items(Joi.string()),
    canonicalUrl: Joi.string().uri().allow(""),
  }).default({}),

  publishedAt: Joi.date().optional(),

  lastEditedAt: Joi.date().optional(),

  version: Joi.number().integer().min(1).default(1),

  isFeatured: Joi.boolean().default(false),

  viewsCount: Joi.number().integer().min(0).default(0),

  commentsCount: Joi.number().integer().min(0).default(0),
});



export default articleValidationSchema;