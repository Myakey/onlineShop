-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NULL,
    `phone_number` VARCHAR(20) NULL,
    `type` ENUM('admin', 'buyer') NOT NULL DEFAULT 'buyer',
    `profile_image_url` VARCHAR(255) NULL,
    `email_verified` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `product_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `description` TEXT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `image_url` VARCHAR(255) NULL,

    FULLTEXT INDEX `products_name_idx`(`name`),
    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `review_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `order_id` INTEGER NULL,
    `rating` INTEGER NOT NULL,
    `title` VARCHAR(200) NULL,
    `comment` TEXT NULL,
    `images` TEXT NULL,
    `is_verified` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `reviews_product_id_idx`(`product_id`),
    INDEX `reviews_user_id_idx`(`user_id`),
    INDEX `reviews_order_id_fkey`(`order_id`),
    UNIQUE INDEX `reviews_user_id_product_id_order_id_key`(`user_id`, `product_id`, `order_id`),
    PRIMARY KEY (`review_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_addresses` (
    `address_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `label` VARCHAR(100) NOT NULL,
    `recipient_name` VARCHAR(200) NOT NULL,
    `phone_number` VARCHAR(20) NOT NULL,
    `street_address` VARCHAR(500) NOT NULL,
    `province_id` INTEGER NULL,
    `city_id` INTEGER NULL,
    `district_id` INTEGER NULL,
    `postal_code` VARCHAR(10) NOT NULL,
    `notes` TEXT NULL,
    `is_default` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `user_addresses_city_id_fkey`(`city_id`),
    INDEX `user_addresses_district_id_fkey`(`district_id`),
    INDEX `user_addresses_province_id_fkey`(`province_id`),
    INDEX `user_addresses_user_id_fkey`(`user_id`),
    PRIMARY KEY (`address_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shopping_carts` (
    `cart_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shopping_carts_user_id_key`(`user_id`),
    PRIMARY KEY (`cart_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cart_items` (
    `cart_item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cart_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `added_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `cart_items_product_id_fkey`(`product_id`),
    UNIQUE INDEX `cart_items_cart_id_product_id_key`(`cart_id`, `product_id`),
    PRIMARY KEY (`cart_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `order_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `address_id` INTEGER NOT NULL,
    `order_number` VARCHAR(50) NOT NULL,
    `total_amount` DECIMAL(10, 2) NOT NULL,
    `shipping_cost` DECIMAL(10, 2) NULL,
    `voucher_discount` DECIMAL(10, 2) NULL,
    `status` ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    `payment_method` VARCHAR(50) NULL,
    `payment_status` ENUM('unpaid', 'paid', 'refunded', 'failed') NOT NULL DEFAULT 'unpaid',
    `payment_proof` VARCHAR(255) NULL,
    `notes` TEXT NULL,
    `payment_due_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `orders_order_number_key`(`order_number`),
    INDEX `orders_address_id_fkey`(`address_id`),
    INDEX `orders_user_id_fkey`(`user_id`),
    PRIMARY KEY (`order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_items` (
    `order_item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,

    INDEX `order_items_order_id_fkey`(`order_id`),
    INDEX `order_items_product_id_fkey`(`product_id`),
    PRIMARY KEY (`order_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otp_codes` (
    `otp_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `email` VARCHAR(150) NOT NULL,
    `code` VARCHAR(6) NOT NULL,
    `purpose` ENUM('email_verification', 'password_reset', 'login_verification') NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `is_used` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `otp_codes_user_id_fkey`(`user_id`),
    PRIMARY KEY (`otp_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `indonesian_provinces` (
    `province_id` INTEGER NOT NULL AUTO_INCREMENT,
    `province_name` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `indonesian_provinces_province_name_key`(`province_name`),
    PRIMARY KEY (`province_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `indonesian_cities` (
    `city_id` INTEGER NOT NULL AUTO_INCREMENT,
    `province_id` INTEGER NOT NULL,
    `city_name` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `indonesian_cities_province_id_city_name_key`(`province_id`, `city_name`),
    PRIMARY KEY (`city_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `indonesian_districts` (
    `district_id` INTEGER NOT NULL AUTO_INCREMENT,
    `city_id` INTEGER NOT NULL,
    `district_name` VARCHAR(100) NOT NULL,
    `zip_code` VARCHAR(10) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `indonesian_districts_city_id_district_name_key`(`city_id`, `district_name`),
    PRIMARY KEY (`district_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shipping_provider_mappings` (
    `mapping_id` INTEGER NOT NULL AUTO_INCREMENT,
    `provider_name` VARCHAR(50) NOT NULL,
    `entity_type` VARCHAR(20) NOT NULL,
    `entity_id` INTEGER NOT NULL,
    `provider_id` INTEGER NOT NULL,
    `province_id` INTEGER NULL,
    `city_id` INTEGER NULL,
    `district_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `shipping_provider_mappings_provider_name_entity_type_provide_idx`(`provider_name`, `entity_type`, `provider_id`),
    INDEX `shipping_provider_mappings_city_id_fkey`(`city_id`),
    INDEX `shipping_provider_mappings_district_id_fkey`(`district_id`),
    INDEX `shipping_provider_mappings_province_id_fkey`(`province_id`),
    UNIQUE INDEX `shipping_provider_mappings_provider_name_entity_type_entity__key`(`provider_name`, `entity_type`, `entity_id`),
    PRIMARY KEY (`mapping_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_addresses` ADD CONSTRAINT `user_addresses_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `indonesian_cities`(`city_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_addresses` ADD CONSTRAINT `user_addresses_district_id_fkey` FOREIGN KEY (`district_id`) REFERENCES `indonesian_districts`(`district_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_addresses` ADD CONSTRAINT `user_addresses_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `indonesian_provinces`(`province_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_addresses` ADD CONSTRAINT `user_addresses_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shopping_carts` ADD CONSTRAINT `shopping_carts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_cart_id_fkey` FOREIGN KEY (`cart_id`) REFERENCES `shopping_carts`(`cart_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `user_addresses`(`address_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `otp_codes` ADD CONSTRAINT `otp_codes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `indonesian_cities` ADD CONSTRAINT `indonesian_cities_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `indonesian_provinces`(`province_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `indonesian_districts` ADD CONSTRAINT `indonesian_districts_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `indonesian_cities`(`city_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipping_provider_mappings` ADD CONSTRAINT `shipping_provider_mappings_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `indonesian_cities`(`city_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipping_provider_mappings` ADD CONSTRAINT `shipping_provider_mappings_district_id_fkey` FOREIGN KEY (`district_id`) REFERENCES `indonesian_districts`(`district_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipping_provider_mappings` ADD CONSTRAINT `shipping_provider_mappings_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `indonesian_provinces`(`province_id`) ON DELETE CASCADE ON UPDATE CASCADE;

