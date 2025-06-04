import express from "express";
import {
  getAllFlags,
  getComments,
} from "../controllers/moderator.controller.js";

const ModeratorRoute = express.Router();
// get all comments route 
ModeratorRoute.get("/comments", getComments);
// get all flags route
ModeratorRoute.get("/flags", getAllFlags);

export default ModeratorRoute;
