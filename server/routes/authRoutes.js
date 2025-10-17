// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { uploadProfileImage } = require("../middleware/profilePicUpload")

// Public routes
router.post('/register', authController.register);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-otp', authController.resendOTP);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);
router.get('/validate-token', authenticateToken, authController.validateToken);
router.post('/upload-profile-image', authenticateToken, uploadProfileImage, authController.uploadProfileImage);

router.delete('/profile-image', authenticateToken, authController.deleteProfileImage);

// Address management routes
router.get('/addresses', authenticateToken, authController.getAddresses);
router.post('/addresses', authenticateToken, authController.addAddress);
router.put('/addresses/:addressId', authenticateToken, authController.updateAddress);
router.delete('/addresses/:addressId', authenticateToken, authController.deleteAddress);

// Location data routes (public)
router.get('/provinces', authController.getProvinces);
router.get('/provinces/:provinceId/cities', authController.getCities);
router.get('/cities/:cityId/districts', authController.getDistricts);

module.exports = router;