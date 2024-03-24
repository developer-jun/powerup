/*
  Warnings:

  - You are about to drop the column `image_url` on the `product` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbUrl` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `image_url`,
    ADD COLUMN `imageUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `inStock` ENUM('INSTOCK', 'OUTOFSTOCK', 'ONBACKORDER') NOT NULL DEFAULT 'INSTOCK',
    ADD COLUMN `published` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `sku` VARCHAR(191) NOT NULL,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL,
    ADD COLUMN `summary` VARCHAR(500) NOT NULL,
    ADD COLUMN `thumbUrl` VARCHAR(191) NOT NULL;
