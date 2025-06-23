import express from "express";
import subscriptionMiddleware from "./../middleware/subscription.middleware.js";
import {
  checkInSuccess,
  checkSubscriptionStatus,
  preSubscriptionStep,
  subscribeFreePlan,
} from "../controllers/subscription.controller.js";

const SubscriptionRouter = express.Router();

SubscriptionRouter.get(
  "/status",
  subscriptionMiddleware,
  checkSubscriptionStatus
);
// create subscription
SubscriptionRouter.post("/plan/:id", subscribeFreePlan);
// pre for subscription
SubscriptionRouter.get("/pre/:id", preSubscriptionStep);
//
SubscriptionRouter.get("/re-check/:id", checkInSuccess);


export default SubscriptionRouter;
