const uploadToCloudinary = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

 
    res.status(200).json({
      success: true,
      message: "File uploaded to Cloudinary successfully",
      public_id: req.file.filename,
      secure_url: req.file.path,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload file to Cloudinary",
      error: error.message,
    });
  }
};

export { uploadToCloudinary };
