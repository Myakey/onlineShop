const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Make the directory if it doesn't exist
const uploadDirectory = "uploads/products";
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "product-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Only image files
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image type files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Helper function to clean up uploaded file on error
const cleanupFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Enhanced middleware that handles errors better
const uploadWithErrorHandling = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Handle Multer-specific errors
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "File too large. Maximum size is 5MB.",
          });
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({
            message: 'Unexpected field name. Use "image" as field name.',
          });
        }
        return res.status(400).json({ message: err.message });
      } else if (err) {
        // Handle other errors (like fileFilter errors)
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  };
};

module.exports = {
  upload,
  uploadWithErrorHandling,
  cleanupFile,
  uploadDirectory,
};
