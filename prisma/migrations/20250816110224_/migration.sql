/*
  Warnings:

  - You are about to drop the column `industry` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_industry_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "industry";
