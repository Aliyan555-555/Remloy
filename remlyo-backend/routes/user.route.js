import express from "express";
import {
  healthProfileStatus,
  getUserHealthQuestionBaseOnHealthProfile,
  userHealthProfile,
  saveRemedy,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post(
  "/health-profile/generate",
  getUserHealthQuestionBaseOnHealthProfile
);
// 
userRouter.post("/health-profile", userHealthProfile);
// checking heath profile status
userRouter.get("/health-profile/status", healthProfileStatus);
// save remedies route
userRouter.post("/remedy/save/:id",saveRemedy);

export default userRouter;
