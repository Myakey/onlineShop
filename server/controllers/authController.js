// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/userModel");
const path = require("path");
const { generateOTP, sendOTPEmail, sendWelcomeEmail } = require("../services/emailService");
const { deleteOldImage } = require("../middleware/profilePicUpload");
const cloudinary = require("../config/cloudinary");

// Refresh tokens in memory (in production use Redis or database)
let refreshTokens = [];

function generateAccessToken(userData) {
    return jwt.sign({
        id: userData.user_id,
        username: userData.username,
        type: userData.type,
        emailVerified: userData.email_verified
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '50m' });
}

function generateRefreshToken(userData) {
    return jwt.sign({
        id: userData.user_id,
        username: userData.username,
        type: userData.type,
        emailVerified: userData.email_verified
    }, process.env.REFRESH_TOKEN_SECRET);
}

// Step 1: Register user (without email verification)
async function register(req, res) {
    try {
        const { username, email, password, firstName, lastName, phoneNumber } = req.body;

        if (!username || !email || !password || !firstName) {
            return res.status(400).json({ 
                error: "Username, email, password, and first name are required!" 
            });
        }

        // Check if user already exists
        const userExistsName = await user.findByUsername(username);
        const userExistsEmail = await user.findByEmail(email);

        if (userExistsName) {
            return res.status(400).json({ error: "Username already exists" });
        }

        if (userExistsEmail) {
            return res.status(400).json({ error: "Email already exists!" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user (unverified)
        const newUser = await user.createUser({
            username,
            email,
            hashedPassword,
            firstName,
            lastName,
            phoneNumber
        });

        // Generate and send OTP
        const otp = generateOTP();
        await user.createOTP(email, otp, 'email_verification', newUser.id);
        
        const emailResult = await sendOTPEmail(email, otp, 'email_verification');
        
        if (!emailResult.success) {
            console.error('Failed to send OTP email:', emailResult.error);
            return res.status(500).json({ 
                error: "Registration successful but failed to send verification email. Please try again." 
            });
        }

        res.status(201).json({
            message: "Registration successful! Please check your email for verification code.",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                type: newUser.type,
                emailVerified: false
            },
            requiresVerification: true
        });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: "Registration failed" });
    }
}

// Step 2: Verify email with OTP
async function verifyEmail(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: "Email and OTP are required" });
        }

        // Verify OTP
        const verification = await user.verifyOTP(email, otp, 'email_verification');
        
        if (!verification.valid) {
            return res.status(400).json({ error: verification.message });
        }

        // Update user as verified
        const userData = await user.findByEmail(email);
        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }

        await user.updateUser(userData.user_id, { emailVerified: true });
        
        // Send welcome email
        await sendWelcomeEmail(email, userData.first_name);

        // Generate tokens for immediate login
        const updatedUser = { ...userData, email_verified: true };
        const accessToken = generateAccessToken(updatedUser);
        const refreshToken = generateRefreshToken(updatedUser);
        refreshTokens.push(refreshToken);

        res.json({
            message: "Email verified successfully! You are now logged in.",
            accessToken,
            refreshToken,
            user: {
                id: userData.user_id,
                username: userData.username,
                email: userData.email,
                firstName: userData.first_name,
                lastName: userData.last_name,
                type: userData.type,
                phoneNumber: userData.phone_number,
                profileImageUrl: userData.profile_image_url,
                emailVerified: true
            }
        });

    } catch (err) {
        console.error('Email verification error:', err);
        res.status(500).json({ error: "Email verification failed" });
    }
}

// Resend OTP
async function resendOTP(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const userData = await user.findByEmail(email);
        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }

        if (userData.email_verified) {
            return res.status(400).json({ error: "Email is already verified" });
        }

        // Generate and send new OTP
        const otp = generateOTP();
        await user.createOTP(email, otp, 'email_verification', userData.user_id);
        
        const emailResult = await sendOTPEmail(email, otp, 'email_verification');
        
        if (!emailResult.success) {
            return res.status(500).json({ error: "Failed to send OTP email" });
        }

        res.json({ message: "OTP sent successfully" });

    } catch (err) {
        console.error('Resend OTP error:', err);
        res.status(500).json({ error: "Failed to resend OTP" });
    }
}

// Login (updated to check email verification)
async function login(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required!" });
        }

        const userExists = await user.findByUsername(username);
        if (!userExists) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const valid = await bcrypt.compare(password, userExists.password_hash);
        if (!valid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Check if email is verified
        if (!userExists.email_verified) {
            return res.status(403).json({ 
                error: "Please verify your email before logging in",
                requiresVerification: true,
                email: userExists.email
            });
        }

        const accessToken = generateAccessToken(userExists);
        const refreshToken = generateRefreshToken(userExists);
        refreshTokens.push(refreshToken);

        res.json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: userExists.user_id,
                username: userExists.username,
                email: userExists.email,
                firstName: userExists.first_name,
                lastName: userExists.last_name,
                type: userExists.type,
                phoneNumber: userExists.phone_number,
                profileImageUrl: userExists.profile_image_url,
                emailVerified: userExists.email_verified
            }
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: "Login failed!" });
    }
}

// Refresh token function
async function refreshToken(req, res) {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    
    if (!refreshTokens.includes(refreshToken)) {
        return res.sendStatus(403);
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, userData) => {
        if (err) return res.sendStatus(403);
        
        const accessToken = generateAccessToken(userData);
        res.json({ accessToken });
    });
}

// Logout function
async function logout(req, res) {
    const { refreshToken } = req.body;
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    res.sendStatus(204);
}

// Get user profile (updated)
async function getProfile(req, res) {
    try {
        const userData = await user.findById(req.user.id);
        if (!userData) {
            return res.status(404).json({ error: "User not found!" });
        }

        res.json({
            user: {
                id: userData.user_id,
                username: userData.username,
                email: userData.email,
                firstName: userData.first_name,
                lastName: userData.last_name,
                type: userData.type,
                phoneNumber: userData.phone_number,
                profileImageUrl: userData.profile_image_url,
                emailVerified: userData.email_verified,
                addresses: userData.addresses
            }
        });
    } catch (err) {
        console.error('Get profile error:', err);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
}

// Update user profile
async function updateProfile(req, res) {
    try {
        const { firstName, lastName, phoneNumber, profileImageUrl } = req.body;

        const success = await user.updateUser(req.user.id, {
            firstName,
            lastName,
            phoneNumber,
            profileImageUrl
        });

        if (success) {
            res.json({ message: "Profile updated successfully" });
        } else {
            res.status(404).json({ error: "User not found!" });
        }
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ error: "Failed to update profile!" });
    }
}

// Add user address
async function addAddress(req, res) {
  try {
    const {
        label,
        recipientName,
        phoneNumber,
        streetAddress,
        city,
        province,
        district,
        postalCode,
        notes,
        isDefault = false,
        latitude,      // ADD THIS
        longitude      // ADD THIS
    } = addressData;

    console.log("ADDING!");

    if (!label || !recipientName || !phoneNumber || !streetAddress || !province || !city || !postalCode) {
      return res.status(400).json({ 
        error: "Label, recipient name, phone number, street address, province, city, and postal code are required" 
      });
    }

    const address = await user.addUserAddress(req.user.id, {
      label,
      recipientName,
      phoneNumber,
      streetAddress,
      city,         // STRING
      province,     // STRING
      district,     // STRING
      postalCode,
      notes,
      isDefault,
      latitude,
      longitude
    });

    res.status(201).json({
      message: "Address added successfully",
      address
    });


  } catch (err) {
    console.error('Add address error:', err);
    res.status(500).json({ error: "Failed to add address" });
  }
}

// REPLACE updateAddress function (line ~380):
async function updateAddress(req, res) {
  try {
    const { addressId } = req.params;
    const {
      label,
      recipientName,
      phoneNumber,
      streetAddress,
      province,  // STRING
      city,      // STRING
      district,  // STRING
      postalCode,
      notes,
      isDefault,
      latitude,
      longitude
    } = req.body;

    const updatedAddress = await user.updateUserAddress(parseInt(addressId), req.user.id, {
      label,
      recipientName,
      phoneNumber,
      streetAddress,
      city,      // STRING
      province,  // STRING
      district,  // STRING
      postalCode,
      notes,
      isDefault,
      latitude,
      longitude
    });

    res.json({
      message: "Address updated successfully",
      address: updatedAddress,
    });

  } catch (err) {
    console.error('Update address error:', err);
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Failed to update address" });
    }
  }
}

// Delete user address
async function deleteAddress(req, res) {
    try {
        const { addressId } = req.params;
        
        const success = await user.deleteUserAddress(parseInt(addressId), req.user.id);
        
        if (success) {
            res.json({ message: "Address deleted successfully" });
        } else {
            res.status(404).json({ error: "Address not found" });
        }

    } catch (err) {
        console.error('Delete address error:', err);
        res.status(500).json({ error: "Failed to delete address" });
    }
}

// Get user addresses
async function getAddresses(req, res) {
    try {
        const addresses = await user.getUserAddresses(req.user.id);
        res.json({ addresses });
    } catch (err) {
        console.error('Get addresses error:', err);
        res.status(500).json({ error: "Failed to fetch addresses" });
    }
}

// Token validation endpoint
async function validateToken(req, res) {
    res.json({ 
        valid: true, 
        user: {
            id: req.user.id,
            username: req.user.username,
            type: req.user.type,
            emailVerified: req.user.emailVerified
        }
    });
}

//Profile Picture Images that needs 

const deleteOldImageFromCloudinary = async (imageUrl) => {
    if (imageUrl && imageUrl.includes('cloudinary.com')) {
        try {
            const parts = imageUrl.split('/');
            const filename = parts[parts.length - 1];
            const publicId = `uploads/profiles/${filename.split('.')[0]}`;
            await cloudinary.uploader.destroy(publicId);
        } catch (err) {
            console.error('Error deleting old image from Cloudinary:', err);
        }
    }
};

async function uploadProfileImage(req, res){
    try{
        if(!req.file){
            return res.status(400).json({error: "No File Upload"});
        }

        // req.file.path is now the Cloudinary URL
        const imageUrl = req.file.path;

        // Get current user data to find old image
        const currentUser = await user.findById(req.user.id);
        
        // Delete old profile image from Cloudinary if it exists
        if (currentUser.profile_image_url) {
            await deleteOldImageFromCloudinary(currentUser.profile_image_url);
        }

        // Update user profile with new Cloudinary URL
        await user.updateUser(req.user.id, { 
            profileImageUrl: imageUrl 
        });

        // Get updated user data
        const updatedUser = await user.findById(req.user.id);

        res.json({
            message: 'Profile image uploaded successfully',
            imageUrl: imageUrl,
            user: {
                id: updatedUser.user_id,
                username: updatedUser.username,
                email: updatedUser.email,
                firstName: updatedUser.first_name,
                lastName: updatedUser.last_name,
                type: updatedUser.type,
                phoneNumber: updatedUser.phone_number,
                profileImageUrl: updatedUser.profile_image_url,
                emailVerified: updatedUser.email_verified
            }
        });
    } catch (err){
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Failed to upload image' });
    }
}

async function deleteProfileImage(req, res) {
    try {
        const currentUser = await user.findById(req.user.id);
        
        if (!currentUser.profile_image_url) {
            return res.status(400).json({ error: 'No profile image to delete' });
        }

        // Delete image from Cloudinary
        await deleteOldImageFromCloudinary(currentUser.profile_image_url);

        // Update user profile
        await user.updateUser(req.user.id, { 
            profileImageUrl: null 
        });

        res.json({ message: 'Profile image deleted successfully' });

    } catch (err) {
        console.error('Delete image error:', err);
        res.status(500).json({ error: 'Failed to delete image' });
    }
}

module.exports = {
    register,
    verifyEmail,
    resendOTP,
    login,
    logout,
    updateProfile,
    refreshToken,
    getProfile,
    validateToken,
    addAddress,
    updateAddress,
    deleteAddress,
    getAddresses,
    uploadProfileImage,
    deleteProfileImage,
};