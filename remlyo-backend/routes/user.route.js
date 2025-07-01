import express from "express";
import validator from "./../validations/validator.js";
import {
  healthProfileStatus,
  getUserHealthQuestionBaseOnHealthProfile,
  userHealthProfile,
  saveRemedy,
  getPaymentHistory,
  getPaymentMethods,
  deleteSavedRemedy,
  addPaymentMethod,
  removePaymentMethod,
  updatePaymentMethod,
  getUserRemedies,
} from "../controllers/user.controller.js";
import userHealthProfileValidation from "../validations/user.validations.js";
import auth from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.post(
  "/health-profile/generate",
  getUserHealthQuestionBaseOnHealthProfile
);
//
userRouter.post(
  "/health-profile",
  validator(userHealthProfileValidation),
  userHealthProfile
);
// checking heath profile status
userRouter.get(
  "/health-profile/status",
  validator(userHealthProfileValidation),
  healthProfileStatus
);
// save remedies route
userRouter.post("/remedy/save/:id", saveRemedy);
// get my remedies
userRouter.get("/remedy/my",getUserRemedies)
// delete save remedies Route
userRouter.patch("/remedy/delete/:id", deleteSavedRemedy);
//get payment history
userRouter.get("/payment/history", getPaymentHistory);
// get payment methods
userRouter.get("/payment/methods", getPaymentMethods);
// add payment method
userRouter.post("/payment/methods", auth, addPaymentMethod);
// remove payment method
userRouter.delete("/payment/methods/:paymentMethodId", auth, removePaymentMethod);
// update payment method
userRouter.patch("/payment/methods/:paymentMethodId", auth, updatePaymentMethod);

export default userRouter;
