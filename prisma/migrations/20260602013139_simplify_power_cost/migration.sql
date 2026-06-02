/*
  Warnings:

  - You are about to drop the column `bodyPower` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `calmPower` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `chaosPower` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `furyPower` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `mindPower` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `orderPower` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `wildPower` on the `Card` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "bodyPower",
DROP COLUMN "calmPower",
DROP COLUMN "chaosPower",
DROP COLUMN "furyPower",
DROP COLUMN "mindPower",
DROP COLUMN "orderPower",
DROP COLUMN "wildPower",
ADD COLUMN     "powerCost" INTEGER NOT NULL DEFAULT 0;
