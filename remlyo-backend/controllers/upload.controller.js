const uploadToCloudinary = (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  return res.status(200).json({
    success: true,
    message: "File uploaded to Cloudinary successfully",
    public_id: req.file.filename,
    secure_url: req.file.path,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });
};

export { uploadToCloudinary };
