-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_parent_fkey` FOREIGN KEY (`parent`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
