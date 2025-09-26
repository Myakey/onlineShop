const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Find user by username
async function findByUsername(username) {
  try {
    const user = await prisma.users.findUnique({
      where: { username },
      select: {
        user_id: true,
        username: true,
        email: true,
        password_hash: true,
        address: true,
        phone_number: true,
        type: true,
        profile_image_url: true
      }
    });
    return user; // null if not found (Prisma returns null instead of undefined)
  } catch (error) {
    throw new Error(`Error finding user by username: ${error.message}`);
  }
}

// Find user by ID (useful for profile updates)
async function findById(userId) {
  try {
    const user = await prisma.users.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        username: true,
        email: true,
        address: true,
        phone_number: true,
        type: true,
        profile_image_url: true
        // Note: password_hash excluded for security
      }
    });
    return user;
  } catch (error) {
    throw new Error(`Error finding user by ID: ${error.message}`);
  }
}

// Find user by email
async function findByEmail(email) {
  try {
    const user = await prisma.users.findUnique({
      where: { email },
      select: {
        user_id: true,
        username: true,
        email: true,
        password_hash: true,
        address: true,
        phone_number: true,
        type: true,
        profile_image_url: true
      }
    });
    return user;
  } catch (error) {
    throw new Error(`Error finding user by email: ${error.message}`);
  }
}

// Create new user with all fields
async function createUser(userData) {
  const { username, email, hashedPassword, address, phoneNumber, type = 'buyer' } = userData;
  
  try {
    const newUser = await prisma.users.create({
      data: {
        username,
        email,
        password_hash: hashedPassword,
        address,
        phone_number: phoneNumber,
        type
      },
      select: {
        user_id: true,
        username: true,
        email: true,
        address: true,
        phone_number: true,
        type: true
      }
    });
    
    return {
      id: newUser.user_id,
      username: newUser.username,
      email: newUser.email,
      address: newUser.address,
      phoneNumber: newUser.phone_number,
      type: newUser.type
    };
  } catch (error) {
    if (error.code === 'P2002') {
      // Prisma unique constraint violation
      throw new Error('Username or email already exists');
    }
    throw new Error(`Error creating user: ${error.message}`);
  }
}

// Update user
async function updateUser(userId, updateData) {
  try {
    // Build the data object for Prisma
    const prismaUpdateData = {};
    
    if (updateData.email) prismaUpdateData.email = updateData.email;
    if (updateData.address) prismaUpdateData.address = updateData.address;
    if (updateData.phoneNumber) prismaUpdateData.phone_number = updateData.phoneNumber;
    if (updateData.profileImageUrl) prismaUpdateData.profile_image_url = updateData.profileImageUrl;
    
    if (Object.keys(prismaUpdateData).length === 0) {
      throw new Error('No fields to update');
    }
    
    const updatedUser = await prisma.users.update({
      where: { user_id: userId },
      data: prismaUpdateData,
      select: {
        user_id: true,
        username: true,
        email: true,
        address: true,
        phone_number: true,
        type: true,
        profile_image_url: true
      }
    });
    
    return updatedUser !== null;
  } catch (error) {
    if (error.code === 'P2025') {
      // Record not found
      return false;
    }
    if (error.code === 'P2002') {
      // Unique constraint violation
      throw new Error('Email already exists');
    }
    throw new Error(`Error updating user: ${error.message}`);
  }
}

// Clean up function to disconnect Prisma (call this when your app shuts down)
async function disconnect() {
  await prisma.$disconnect();
}

module.exports = { 
  findByUsername, 
  createUser, 
  findByEmail, 
  findById, 
  updateUser,
  disconnect 
};const db = require('../config/database');

// find user by username
async function findByUsername(username) {
  const [rows] = await db.query(
    'SELECT user_id, username, email, password_hash, address, phone_number, type, profile_image_url FROM users WHERE username = ?', 
    [username]
  );
  return rows[0]; // undefined if not found
}

// Find user by ID (useful for profile updates)
async function findById(userId) {
  const [rows] = await db.query(
    'SELECT user_id, username, email, address, phone_number, type, profile_image_url FROM users WHERE user_id = ?', 
    [userId]
  );
  return rows[0];
}

async function findByEmail(email) {
  const [rows] = await db.query(
    'SELECT user_id, username, email, password_hash, address, phone_number, type, profile_image_url FROM users WHERE email = ?', 
    [email]
  );
  return rows[0];
}

// create new user
// Create new user with all fields
async function createUser(userData) {
  const { username, email, hashedPassword, address, phoneNumber, type = 'buyer' } = userData;
  
  const [result] = await db.query(
    'INSERT INTO users (username, email, password_hash, address, phone_number, type) VALUES (?, ?, ?, ?, ?, ?)',
    [username, email, hashedPassword, address, phoneNumber, type]
  );
  
  return { 
    id: result.insertId, 
    username, 
    email, 
    address, 
    phoneNumber, 
    type 
  };
}

async function updateUser(userId, updateData) {
  const fields = [];
  const values = [];
  
  if (updateData.email) {
    fields.push('email = ?');
    values.push(updateData.email);
  }
  if (updateData.address) {
    fields.push('address = ?');
    values.push(updateData.address);
  }
  if (updateData.phoneNumber) {
    fields.push('phone_number = ?');
    values.push(updateData.phoneNumber);
  }
  if (updateData.profileImageUrl) {
    fields.push('profile_image_url = ?');
    values.push(updateData.profileImageUrl);
  }
  
  if (fields.length === 0) {
    throw new Error('No fields to update');
  }
  
  values.push(userId);
  
  const [result] = await db.query(
    `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`,
    values
  );
  
  return result.affectedRows > 0;
}



module.exports = { findByUsername, createUser, findByEmail, findById, updateUser };