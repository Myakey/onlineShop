-- Create database (change "shopdb" to whatever you want)
CREATE DATABASE IF NOT EXISTS shopdb;
USE shopdb;

-- Drop tables if they exist (to avoid conflicts on re-run)
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    phone_number VARCHAR(20),
    type ENUM('admin', 'buyer') DEFAULT 'buyer',
    profile_image_url VARCHAR(255)
);

-- Products table
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    image_url VARCHAR(255)
);
