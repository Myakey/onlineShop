const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

// Use memory storage instead of disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    }
});

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                transformation: [{ width: 500, height: 500, crop: 'limit' }]
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        const readableStream = Readable.from(buffer);
        readableStream.pipe(uploadStream);
    });
};

// Upload wrapper with error handling and Cloudinary upload
// Upload wrapper with error handling and Cloudinary upload
const uploadProfileImage = (req, res, next) => {
    upload.single('profileImage')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ 
                    error: 'File too large. Maximum size is 5MB.' 
                });
            }
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({ 
                    error: 'Unexpected field name. Use "profileImage" as field name.' 
                });
            }
            return res.status(400).json({ error: err.message });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }

        // If file exists, upload to Cloudinary
        if (req.file) {
            try {
                console.log('Uploading to Cloudinary...', {
                    bufferSize: req.file.buffer.length,
                    mimetype: req.file.mimetype
                });
                
                const result = await uploadToCloudinary(req.file.buffer, 'uploads/profiles');
                
                console.log('Cloudinary upload success:', {
                    url: result.secure_url,
                    public_id: result.public_id
                });
                
                req.file.path = result.secure_url;
                req.file.cloudinary_id = result.public_id;
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError); // ← ADD THIS
                return res.status(500).json({ 
                    error: 'Failed to upload to Cloudinary',
                    details: uploadError.message // ← ADD THIS
                });
            }
        }

        next();
    });
};

// Delete old image from Cloudinary
// Delete old image from Cloudinary
const deleteOldImage = async (imageUrl) => {
    if (imageUrl && imageUrl.includes('cloudinary.com')) {
        try {
            // Cloudinary URL format: https://res.cloudinary.com/cloud-name/image/upload/v123456/folder/filename.jpg
            // We need to extract: folder/filename (without extension)
            
            const urlParts = imageUrl.split('/upload/');
            if (urlParts.length < 2) {
                console.error('Invalid Cloudinary URL format');
                return;
            }
            
            // Get everything after '/upload/' (e.g., "v123456/uploads/profiles/abc123.jpg")
            const pathAfterUpload = urlParts[1];
            
            // Remove version prefix (v123456/) if present
            const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, '');
            
            // Remove file extension
            const publicId = pathWithoutVersion.replace(/\.[^/.]+$/, '');
            
            console.log('Deleting from Cloudinary, public_id:', publicId);
            
            await cloudinary.uploader.destroy(publicId);
            console.log('Successfully deleted:', publicId);
        } catch (err) {
            console.error('Error deleting old image:', err);
        }
    }
};

module.exports = {
    uploadProfileImage,
    deleteOldImage
};