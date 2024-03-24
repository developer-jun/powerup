-- AlterTable
ALTER TABLE `product` MODIFY `description` VARCHAR(1000) NOT NULL;

-- CreateTable
CREATE TABLE `option` (
    `option_id` INTEGER NOT NULL AUTO_INCREMENT,
    `option_name` VARCHAR(191) NOT NULL,
    `option_description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`option_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `optionitem` (
    `item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `item_name` VARCHAR(191) NOT NULL,
    `option_id` INTEGER NOT NULL,

    INDEX `OptionItem_option_id_fkey`(`option_id`),
    PRIMARY KEY (`item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productoptions` (
    `productoption_id` INTEGER NOT NULL AUTO_INCREMENT,
    `option_id` INTEGER NOT NULL,
    `optionitem_id` INTEGER NOT NULL,
    `additional_info` VARCHAR(191) NOT NULL,
    `addon_price` DOUBLE NOT NULL,
    `active` BOOLEAN NOT NULL,

    INDEX `ProductOption_option_id_fkey`(`option_id`),
    INDEX `ProductOption_item_id_fkey`(`optionitem_id`),
    PRIMARY KEY (`productoption_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `optionitem` ADD CONSTRAINT `OptionItem_option_id_fkey` FOREIGN KEY (`option_id`) REFERENCES `option`(`option_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productoptions` ADD CONSTRAINT `ProductOption_option_id_fkey` FOREIGN KEY (`option_id`) REFERENCES `option`(`option_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productoptions` ADD CONSTRAINT `ProductOption_item_id_fkey` FOREIGN KEY (`optionitem_id`) REFERENCES `optionitem`(`item_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
