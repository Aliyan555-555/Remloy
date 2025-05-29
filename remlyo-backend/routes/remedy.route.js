import express from "express";
import {
  createRemedy,
  deleteRemedy,
  getAllRemedies,
  flagRemedy,
  getRemedyById,
  updateRemedy,
} from "../controllers/remedy.controller.js";
import auth from "../middleware/auth.middleware.js";

const RemedyRouter = express.Router();
// create remedy route
RemedyRouter.post("/create", auth, createRemedy);
// get all remedy
RemedyRouter.get("/", getAllRemedies);
// get remedy by id
RemedyRouter.get("/:id", getRemedyById);
// remedy flag route
RemedyRouter.post("/flag/:id",auth, flagRemedy);
// update remedy by id
RemedyRouter.put("/:id",auth, updateRemedy);
// delete remedy by id
RemedyRouter.delete("/:id",auth, deleteRemedy);

export default RemedyRouter;
