/*
  Warnings:

  - You are about to drop the column `city_type` on the `indonesian_cities` table. All the data in the column will be lost.
  - You are about to drop the column `postal_codes` on the `indonesian_cities` table. All the data in the column will be lost.
  - You are about to drop the column `province_code` on the `indonesian_provinces` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `user_addresses` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `user_addresses` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `user_addresses` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `indonesian_cities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `indonesian_provinces` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `indonesian_cities` DROP FOREIGN KEY `indonesian_cities_province_id_fkey`;

-- DropIndex
DROP INDEX `indonesian_cities_province_id_idx` ON `indonesian_cities`;

-- DropIndex
DROP INDEX `indonesian_provinces_province_code_key` ON `indonesian_provinces`;

-- AlterTable
ALTER TABLE `indonesian_cities` DROP COLUMN `city_type`,
    DROP COLUMN `postal_codes`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `indonesian_provinces` DROP COLUMN `province_code`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `user_addresses` DROP COLUMN `city`,
    DROP COLUMN `district`,
    DROP COLUMN `province`,
    ADD COLUMN `city_id` INTEGER NULL,
    ADD COLUMN `district_id` INTEGER NULL,
    ADD COLUMN `province_id` INTEGER NULL;

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
    UNIQUE INDEX `shipping_provider_mappings_provider_name_entity_type_entity__key`(`provider_name`, `entity_type`, `entity_id`),
    PRIMARY KEY (`mapping_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_addresses` ADD CONSTRAINT `user_addresses_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `indonesian_provinces`(`province_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_addresses` ADD CONSTRAINT `user_addresses_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `indonesian_cities`(`city_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_addresses` ADD CONSTRAINT `user_addresses_district_id_fkey` FOREIGN KEY (`district_id`) REFERENCES `indonesian_districts`(`district_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `indonesian_cities` ADD CONSTRAINT `indonesian_cities_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `indonesian_provinces`(`province_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `indonesian_districts` ADD CONSTRAINT `indonesian_districts_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `indonesian_cities`(`city_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipping_provider_mappings` ADD CONSTRAINT `shipping_provider_mappings_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `indonesian_provinces`(`province_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipping_provider_mappings` ADD CONSTRAINT `shipping_provider_mappings_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `indonesian_cities`(`city_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipping_provider_mappings` ADD CONSTRAINT `shipping_provider_mappings_district_id_fkey` FOREIGN KEY (`district_id`) REFERENCES `indonesian_districts`(`district_id`) ON DELETE CASCADE ON UPDATE CASCADE;
