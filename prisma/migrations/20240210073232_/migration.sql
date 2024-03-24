-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `category_parent_fkey`;

-- AlterTable
ALTER TABLE `category` MODIFY `parent` INTEGER NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_parent_fkey` FOREIGN KEY (`parent`) REFERENCES `category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
