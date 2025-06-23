import express from "express";
import { getAllPlans } from "../controllers/plan.controller.js";
import auth from "../middleware/auth.middleware.js";

const PlanRouter = express.Router();
// get all pricing ManagePlanPage
PlanRouter.get("/",auth, getAllPlans);

export default PlanRouter;
