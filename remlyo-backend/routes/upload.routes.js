import express from "express";
import multer from "multer";
import { uploadToCloudinary } from "../controllers/upload.controller.js";
import { storage } from "./../config/cloudinary.config.js";

const uploadRouter = express.Router();

// Configure multer
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
    files: 10, // Max 10 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "text/csv",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new multer.MulterError(
          "LIMIT_UNEXPECTED_FILE",
          `Unsupported file type: ${file.mimetype}`
        )
      );
    }
  },
});

// Multer middleware wrapper
const multerMiddleware = (req, res, next) => {
  upload.array("files", 10)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors
      return res.status(400).json({
        success: false,
        message: err.message,
        type: "MULTER_ERROR",
      });
    } else if (err) {
      // Unknown error
      return res.status(500).json({
        success: false,
        message: err.message || "Unknown error during file upload",
        type: err.code || "UNKNOWN_UPLOAD_ERROR",
      });
    }
    next();
  });
};

// Main upload route
uploadRouter.post("/multiple", multerMiddleware, async (req, res, next) => {
  try {
    await uploadToCloudinary(req, res);
  } catch (err) {
    next(err); // Pass to general error handler
  }
});

// Final error handler (including network errors)
uploadRouter.use((err, req, res, next) => {
  console.error("Upload error:", err);

  const isNetworkError =
    err.code === "ECONNABORTED" ||
    err.message?.includes("network") ||
    err.message?.includes("timeout");

  res.status(500).json({
    success: false,
    message: isNetworkError
      ? "Network error occurred. Please check your connection and try again."
      : err.message || "An unexpected error occurred during upload.",
    type: isNetworkError ? "NETWORK_ERROR" : "UPLOAD_ERROR",
    error: err.name || "UPLOAD_ERROR",
  });
});

export default uploadRouter;
