import express from "express";
import { storage } from "../config/cloudinary.config.js";
import multer from "multer";
import { uploadToCloudinary } from "../controllers/upload.controller.js";

const uploadRouter = express.Router();

const upload = multer({ storage });

uploadRouter.post("/image", upload.single("file"), uploadToCloudinary);

export default uploadRouter;
