-- Create database (change "shopdb" to whatever you want)
CREATE DATABASE IF NOT EXISTS online_shop;
USE online_shop;

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

INSERT INTO products (product_id, name, description, price, stock, image_url) VALUES
(7, 'Gitar bass', 'Keren banget ya', 10.00, 14, '/uploads/products/product-1758586977292-133156263.png'),
(8, 'Kacamata Keren', 'DIjual Kacamata tingkat tinggi', 2000.00, 9, '/uploads/products/product-1758587061892-530940895.png'),
(9, 'Payung raksasa', 'Keren banget payungnya brow', 200.00, 2000, '/uploads/products/product-1758587997801-805904439.png'),
(10, 'Jaket Coklat', 'Jaket ini sudah dites dengan panas suhu 1000 derajat selsius, matahari pun kalah', 1250.00, 10000, '/uploads/products/product-1758588186630-167848037.jpeg'),
(12, 'PowerBank 1000000000000 mAh', 'Powerbank ini tahan 50.000 tahun', 1.00, 1, '/uploads/products/product-1758588802012-206376285.jpeg'),
(13, 'Baju Putih', 'Telah melewati 1000 abad, bisa than 20 000 tahun', 12.00, 1, '/uploads/products/product-1758588967808-910519393.jpeg');