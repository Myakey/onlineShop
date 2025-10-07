-- AlterTable
ALTER TABLE `orders` ADD COLUMN `payment_due_at` DATETIME(3) NULL,
    ADD COLUMN `payment_proof` VARCHAR(255) NULL,
    ADD COLUMN `shipping_cost` DECIMAL(10, 2) NULL,
    ADD COLUMN `voucher_discount` DECIMAL(10, 2) NULL;
