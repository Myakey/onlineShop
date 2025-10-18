/*
  Warnings:

  - A unique constraint covering the columns `[secure_token]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `secure_token` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `secure_token` VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `orders_secure_token_key` ON `orders`(`secure_token`);

-- CreateIndex
CREATE INDEX `orders_secure_token_idx` ON `orders`(`secure_token`);
