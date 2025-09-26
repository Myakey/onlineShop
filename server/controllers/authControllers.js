const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/users");

//Refresh in memory (Redis, database)
let refreshTokens = [];

function generateAccessToken(user){
    return jwt.sign({
        id: user.user_id,
        username: user.username,
        type: user.type
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m'})
}

function generateRefreshToken(user){
    return jwt.sign(
        {
            id: user.user_id,
            username: user.username,
            type: user.type
        },
        process.env.REFRESH_TOKEN_SECRET
    );
}

async function register(req, res) {
    try {
        const { username, email, password, address, phoneNumber } = req.body;

        if(!username || !email || !password){
            return res.status(400).json({ error: "Username, email, and password required! "});
        }

        const userExistsName = await user.findByUsername(req.body.username);

        const userExistsEmail = await user.findByEmail(email);

        if (userExistsName){
            return res.status(400).json({ error: "Username already exists" });
        } 

        if (userExistsEmail){
            return res.status(400).json({ error: "Email already exists! "});
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await user.createUser({
            username, 
            email, 
            hashedPassword, 
            address, 
            phoneNumber
        });

        res.status(201).json({ message: "User registered", user: newUser });
    } catch (err){
        console.log(err);
        res.status(500).json({ message: "Registration failed" });
    }
}

async function login(req, res){
    try{
        const {username, password} = req.body;

        if(!username || !password){
            return res.status(400).json({ error: "Username and password are required! "})
        }

        const userExists = await user.findByUsername(username);
        if (!userExists) {
            return res.status(400).json({ error: "User not found!" });
        }

        const valid = await bcrypt.compare(password, userExists.password_hash);
        if (!valid) return res.status(403).json({ error: "Invalid password!" });

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
                type: userExists.type,
                address: userExists.address,
                phoneNumber: userExists.phone_number,
                profileImageUrl: userExists.profile_image_url
            }
        });
    } catch (err){
        console.log(err);
        res.status(500).json({ error: "login Failed!" });
    }
}

function token(req, res){
    const { refreshToken } = req.body

    if(!refreshToken) return res.sendStatus(401);

    if(!refreshToken.includes(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        const accessToken = generateAccessToken(user);
        res.json({ accessToken });
    });
}

async function logout(req, res){
    const {refreshToken} = req.body;
    refreshToken = refreshTokens.filter(token => token != refreshToken);
    res.sendStatus(204);
}

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

async function logout(req, res) {
    const { refreshToken } = req.body;
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    res.sendStatus(204);
}

async function getProfile(req, res){
    try{
        const userData = await user.findById(req.user.id);
        if(!userData){
            return res.status(404).json({ error: "User not found! "});
        }

        res.json({
            user:{
                id: userData.user_id,
                username: userData.username,
                email: userData.email,
                type: userData.type,
                address: userData.address,
                phoneNumber: userData.phone_number,
                profileImageUrl: userData.profile_image_url
            }
        })
    } catch (err){
        console.error(err);
        req.status(500).json({ error: "Failed to fetch profile "});
    }
}

async function updateProfile(req, res){
    try{
        const {email, address, phoneNumber, profileImageUrl} = req.body;

        const success = await user.updateUser(req.user.id,{
            email,
            address,
            phoneNumber,
            profileImageUrl
        });

        if(success){
            res.json({ message: "Profile updated successfully "});
        }else{
            res.status(404).json({error: "User not found!"});
        }
    } catch(err){
        console.error(err);
        res.status(500).json({ error: "Failed to update profile! "});
    }
    
}

module.exports = {
    register,
    login,
    logout,
    updateProfile,
    refreshToken,
    getProfile
};