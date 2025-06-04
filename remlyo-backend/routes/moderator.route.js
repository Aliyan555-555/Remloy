import express from 'express';
import { getComments } from '../controllers/moderator.controller.js';

const ModeratorRoute = express.Router();

ModeratorRoute.get("/comments", getComments)



export default ModeratorRoute;