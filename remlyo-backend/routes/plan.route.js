import express from "express";
import { getAllPlans, getPlan } from "../controllers/plan.controller.js";
// import auth from "../middleware/auth.middleware.js";

const PlanRouter = express.Router();
// get all pricing ManagePlanPage
PlanRouter.get("/", getAllPlans);
// get plan by id
PlanRouter.get("/:id", getPlan)

export default PlanRouter;
