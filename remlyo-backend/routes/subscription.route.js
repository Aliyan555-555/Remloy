import express from "express";
import subscriptionMiddleware from "./../middleware/subscription.middleware.js";
import {
  checkInSuccess,
  checkSubscriptionStatus,
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
// 


export default SubscriptionRouter;
