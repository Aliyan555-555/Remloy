import express from "express";
import { createReview, getReviewRatingsByRemedyId } from "../controllers/review.controller.js";
import auth from "../middleware/auth.middleware.js";
import validator from './../validations/validator.js';
import { reviewValidation } from "../validations/review.validation.js";


const reviewRouter = express.Router();

reviewRouter.post('/',auth,validator(reviewValidation),createReview);
reviewRouter.get("/remedy/:id",getReviewRatingsByRemedyId)
// reviewRouter.get("/remedy/flg",getReviewRatingsByRemedyId)




export default reviewRouter;