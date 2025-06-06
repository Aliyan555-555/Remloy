// config/cloudinary.js
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { config } from "dotenv";

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads", // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png", "webp"], // Allowed file types
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

export { cloudinary, storage };
