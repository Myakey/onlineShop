const jwt = require('jsonwebtoken');
const user = require('../models/userModel'); // or however you access your user model

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// NEW: Check email verification from database
async function requireVerifiedEmail(req, res, next) {
    try {
        // Fetch fresh data from database
        const userRecord = await user.findById(req.user.id); // or whatever your method is
        
        if (!userRecord) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!userRecord.email_verified) {
            return res.status(403).json({ 
                error: "Please verify your email to perform this action",
                requiresVerification: true
            });
        }

        // Optionally attach fresh user data to request
        req.userFromDb = userRecord;
        next();
    } catch (err) {
        console.error('Email verification check error:', err);
        res.status(500).json({ error: "Verification check failed" });
    }
}

// Combine both checks
function requireVerifiedUser(req, res, next) {
    authenticateToken(req, res, async () => {
        await requireVerifiedEmail(req, res, next);
    });
}

function requireAdmin(req, res, next){
    authenticateToken(req, res, async () => {
        // Also check admin status from database for security
        try {
            const userRecord = await user.findById(req.user.user_id);
            
            if (!userRecord || userRecord.type !== 'admin') {
                return res.status(403).json({ error: "Admin access required!" });
            }
            
            req.userFromDb = userRecord;
            next();
        } catch (err) {
            console.error('Admin check error:', err);
            res.status(500).json({ error: "Authorization check failed" });
        }
    });
}

function optionalAuth(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        req.user = null;
        return next();
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            req.user = null;
        } else {
            req.user = user;
        }
        next();
    });
}

module.exports = {
    authenticateToken,
    requireAdmin,
    optionalAuth,
    requireVerifiedEmail,
    requireVerifiedUser
}