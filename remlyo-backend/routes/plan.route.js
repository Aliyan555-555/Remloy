import express from "express";
import { getAllPlans, getPlan, getPlanStats, checkPlanEligibility } from "../controllers/plan.controller.js";
import auth from "../middleware/auth.middleware.js";

const PlanRouter = express.Router();

// get all pricing plans
PlanRouter.get("/", getAllPlans);

// get plan by id
PlanRouter.get("/:id", getPlan);

// get plan statistics (admin only)
PlanRouter.get("/stats/overview", auth, getPlanStats);

// check if user can subscribe to a specific plan
PlanRouter.get("/:planId/eligibility", auth, checkPlanEligibility);

export default PlanRouter;
