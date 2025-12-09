const multer = require("multer");
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

// Cloudinary upload helper
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
};

// Use single file: field "proof"
const uploadPaymentProof = async (req, res, next) => {
  upload.single("paymentProof")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Payment proof image is required",
      });
    }

    try {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "uploads/payment_proofs"
      );

      req.uploadedProof = {
        url: result.secure_url,
        public_id: result.public_id,
      };

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload proof to Cloudinary",
      });
    }
  });
};

const cleanupCloudinaryFile = async (public_id) => {
  if (!public_id) return;

  try {
    await cloudinary.uploader.destroy(public_id);
    console.log("Cleaned Cloudinary file:", public_id);
  } catch (err) {
    console.error("Failed to cleanup Cloudinary file:", err);
  }
};

module.exports = {
  uploadPaymentProof,
  cleanupCloudinaryFile
};


