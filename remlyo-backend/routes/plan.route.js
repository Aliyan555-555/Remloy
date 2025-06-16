import express from "express";
import { getAllPlans } from "../controllers/plan.controller.js";

const PlanRouter = express.Router();
// get all pricing ManagePlanPage
PlanRouter.get("/", getAllPlans);

export default PlanRouter;
