// models/users.js
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
        first_name: true,
        last_name: true,
        phone_number: true,
        type: true,
        profile_image_url: true,
        email_verified: true
      }
    });
    return user;
  } catch (error) {
    throw new Error(`Error finding user by username: ${error.message}`);
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
        first_name: true,
        last_name: true,
        phone_number: true,
        type: true,
        profile_image_url: true,
        email_verified: true
      }
    });
    return user;
  } catch (error) {
    throw new Error(`Error finding user by email: ${error.message}`);
  }
}

// Find user by ID
async function findById(userId) {
  try {
    const user = await prisma.users.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        phone_number: true,
        type: true,
        profile_image_url: true,
        email_verified: true,
        addresses: {
          select: {
            address_id: true,
            label: true,
            recipient_name: true,
            phone_number: true,
            street_address: true,
            province_id: true,
            city_id: true,
            district_id: true,
            postal_code: true,
            notes: true,
            is_default: true,
            province: {
              select: {
                province_name: true
              }
            },
            city: {
              select: {
                city_name: true
              }
            },
            district: {
              select: {
                district_name: true
              }
            }
          },
          orderBy: [
            { is_default: 'desc' },
            { created_at: 'asc' }
          ]
        }
      }
    });
    return user;
  } catch (error) {
    throw new Error(`Error finding user by ID: ${error.message}`);
  }
}

// Create new user
async function createUser(userData) {
  const { username, email, hashedPassword, firstName, lastName, phoneNumber, type = 'buyer' } = userData;
  
  try {
    const newUser = await prisma.users.create({
      data: {
        username,
        email,
        password_hash: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        type,
        email_verified: false
      },
      select: {
        user_id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        phone_number: true,
        type: true,
        email_verified: true
      }
    });
    
    return {
      id: newUser.user_id,
      username: newUser.username,
      email: newUser.email,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      phoneNumber: newUser.phone_number,
      type: newUser.type,
      emailVerified: newUser.email_verified
    };
  } catch (error) {
    if (error.code === 'P2002') {
      throw new Error('Username or email already exists');
    }
    throw new Error(`Error creating user: ${error.message}`);
  }
}

// Update user
async function updateUser(userId, updateData) {
  try {
    const prismaUpdateData = {};
    
    if (updateData.firstName) prismaUpdateData.first_name = updateData.firstName;
    if (updateData.lastName !== undefined) prismaUpdateData.last_name = updateData.lastName;
    if (updateData.phoneNumber) prismaUpdateData.phone_number = updateData.phoneNumber;
    if (updateData.profileImageUrl) prismaUpdateData.profile_image_url = updateData.profileImageUrl;
    if (updateData.emailVerified !== undefined) prismaUpdateData.email_verified = updateData.emailVerified;
    
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
        first_name: true,
        last_name: true,
        phone_number: true,
        type: true,
        profile_image_url: true,
        email_verified: true
      }
    });
    
    return updatedUser !== null;
  } catch (error) {
    if (error.code === 'P2025') {
      return false;
    }
    throw new Error(`Error updating user: ${error.message}`);
  }
}

// OTP related functions
async function createOTP(email, code, purpose, userId = null) {
  try {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    await prisma.otp_codes.deleteMany({
      where: {
        email,
        purpose,
        is_used: false
      }
    });
    
    const otpRecord = await prisma.otp_codes.create({
      data: {
        user_id: userId,
        email,
        code,
        purpose,
        expires_at: expiresAt
      }
    });
    
    return otpRecord;
  } catch (error) {
    throw new Error(`Error creating OTP: ${error.message}`);
  }
}

async function verifyOTP(email, code, purpose) {
  try {
    const otpRecord = await prisma.otp_codes.findFirst({
      where: {
        email,
        code,
        purpose,
        is_used: false,
        expires_at: {
          gt: new Date()
        }
      }
    });
    
    if (!otpRecord) {
      return { valid: false, message: 'Invalid or expired OTP' };
    }
    
    await prisma.otp_codes.update({
      where: { otp_id: otpRecord.otp_id },
      data: { is_used: true }
    });
    
    return { valid: true, otpRecord };
  } catch (error) {
    throw new Error(`Error verifying OTP: ${error.message}`);
  }
}

// Address related functions
async function addUserAddress(userId, addressData) {
  try {
    const {
      label,
      recipientName,
      phoneNumber,
      streetAddress,
      provinceId,
      cityId,
      districtId,
      postalCode,
      notes,
      isDefault = false
    } = addressData;
    
    if (isDefault) {
      await prisma.user_addresses.updateMany({
        where: { user_id: userId },
        data: { is_default: false }
      });
    }
    
    const address = await prisma.user_addresses.create({
      data: {
        user_id: userId,
        label,
        recipient_name: recipientName,
        phone_number: phoneNumber,
        street_address: streetAddress,
        province_id: provinceId,
        city_id: cityId,
        district_id: districtId,
        postal_code: postalCode,
        notes,
        is_default: isDefault
      }
    });
    
    return address;
  } catch (error) {
    throw new Error(`Error adding address: ${error.message}`);
  }
}

async function updateUserAddress(addressId, userId, addressData) {
  try {
    const {
      label,
      recipientName,
      phoneNumber,
      streetAddress,
      provinceId,
      cityId,
      districtId,
      postalCode,
      notes,
      isDefault
    } = addressData;
    
    if (isDefault) {
      await prisma.user_addresses.updateMany({
        where: { 
          user_id: userId,
          address_id: { not: addressId }
        },
        data: { is_default: false }
      });
    }
    
    const updatedAddress = await prisma.user_addresses.update({
      where: { 
        address_id: addressId,
        user_id: userId
      },
      data: {
        label,
        recipient_name: recipientName,
        phone_number: phoneNumber,
        street_address: streetAddress,
        province_id: provinceId,
        city_id: cityId,
        district_id: districtId,
        postal_code: postalCode,
        notes,
        is_default: isDefault
      }
    });
    
    return updatedAddress;
  } catch (error) {
    if (error.code === 'P2025') {
      throw new Error('Address not found or access denied');
    }
    throw new Error(`Error updating address: ${error.message}`);
  }
}

async function deleteUserAddress(addressId, userId) {
  try {
    await prisma.user_addresses.delete({
      where: { 
        address_id: addressId,
        user_id: userId
      }
    });
    return true;
  } catch (error) {
    if (error.code === 'P2025') {
      return false;
    }
    throw new Error(`Error deleting address: ${error.message}`);
  }
}

async function getUserAddresses(userId) {
  try {
    const addresses = await prisma.user_addresses.findMany({
      where: { user_id: userId },
      include: {
        province: true,
        city: true,
        district: true
      },
      orderBy: [
        { is_default: 'desc' },
        { created_at: 'asc' }
      ]
    });
    return addresses;
  } catch (error) {
    throw new Error(`Error fetching addresses: ${error.message}`);
  }
}

// Indonesian location data functions
async function getProvinces() {
  try {
    const provinces = await prisma.indonesian_provinces.findMany({
      orderBy: { province_name: 'asc' }
    });
    return provinces;
  } catch (error) {
    throw new Error(`Error fetching provinces: ${error.message}`);
  }
}

async function getCitiesByProvince(provinceId) {
  try {
    const cities = await prisma.indonesian_cities.findMany({
      where: { province_id: parseInt(provinceId) },
      orderBy: { city_name: 'asc' }
    });
    return cities;
  } catch (error) {
    throw new Error(`Error fetching cities: ${error.message}`);
  }
}

async function getDistrictsByCity(cityId) {
  try {
    const districts = await prisma.indonesian_districts.findMany({
      where: { city_id: parseInt(cityId) },
      orderBy: { district_name: 'asc' }
    });
    return districts;
  } catch (error) {
    throw new Error(`Error fetching districts: ${error.message}`);
  }
}

module.exports = { 
  findByUsername,
  findByEmail,
  findById,
  createUser,
  updateUser,
  createOTP,
  verifyOTP,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  getUserAddresses,
  getProvinces,
  getCitiesByProvince,
  getDistrictsByCity
};