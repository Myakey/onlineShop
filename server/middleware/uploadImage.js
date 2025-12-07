const multer = require("multer");
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
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

// Helper to upload to Cloudinary
const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: folder },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        Readable.from(buffer).pipe(uploadStream);
    });
};

// Helper to delete from Cloudinary
// Helper to delete from Cloudinary
const cleanupFile = async (fileUrl) => {
  if (fileUrl && fileUrl.includes('cloudinary.com')) {
    try {
      // Extract public_id properly
      const urlParts = fileUrl.split('/upload/');
      if (urlParts.length < 2) {
        console.error('Invalid Cloudinary URL format');
        return;
      }
      
      const pathAfterUpload = urlParts[1];
      const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, '');
      const publicId = pathWithoutVersion.replace(/\.[^/.]+$/, '');
      
      console.log('Deleting from Cloudinary, public_id:', publicId);
      await cloudinary.uploader.destroy(publicId);
      console.log('Successfully deleted:', publicId);
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  }
};

const uploadWithErrorHandling = (fieldName) => {
  return async (req, res, next) => {
    upload.single(fieldName)(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
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
        return res.status(400).json({ message: err.message });
      }

      // Upload to Cloudinary if file exists
      if (req.file) {
        try {
          const result = await uploadToCloudinary(req.file.buffer, 'uploads/products');
          console.log(result);
          req.file.path = result.secure_url;
          req.file.cloudinary_id = result.public_id;
        } catch (uploadError) {
          return res.status(500).json({ message: 'Failed to upload to Cloudinary' });
        }
      }

      next();
    });
  };
};

const uploadMultipleWithErrorHandling = (fieldName, maxCount = 5) => {
  return async (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "File too large. Maximum size is 5MB per file.",
          });
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({
            message: `Unexpected field name. Use "${fieldName}" as field name.`,
          });
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).json({
            message: `Too many files. Maximum is ${maxCount} files.`,
          });
        }
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }

      // Upload all files to Cloudinary
      if (req.files && req.files.length > 0) {
        try {
          req.files = await Promise.all(
            req.files.map(async (file) => {
              const result = await uploadToCloudinary(file.buffer, 'uploads/products');
              return {
                ...file,
                path: result.secure_url,
                cloudinary_id: result.public_id,
              };
            })
          );
        } catch (uploadError) {
          return res.status(500).json({ 
            message: 'Failed to upload images to Cloudinary',
            error: uploadError.message 
          });
        }
      }

      next();
    });
  };
};

module.exports = {
  uploadWithErrorHandling,
  cleanupFile,
  uploadMultipleWithErrorHandling
};