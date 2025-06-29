import express from "express";
import subscriptionMiddleware from "./../middleware/subscription.middleware.js";
import {
  checkInSuccess,
  checkSubscriptionStatus,
  generateRecipe,
  preSubscriptionStep,
  subscribePlan,
} from "../controllers/subscription.controller.js";

const SubscriptionRouter = express.Router();

SubscriptionRouter.get(
  "/status",
  subscriptionMiddleware,
  checkSubscriptionStatus
);
// Unified create subscription (free or paid)
SubscriptionRouter.post("/plan/:id", subscribePlan);
// pre for subscription
SubscriptionRouter.get("/pre/:id", preSubscriptionStep);
// re check subscription
SubscriptionRouter.get("/re-check/:id", checkInSuccess);
// generate receipt
SubscriptionRouter.get("/download/receipt/:id", generateRecipe);

export default SubscriptionRouter;
