/*
  Warnings:

  - Made the column `content` on table `Resume` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Resume" ALTER COLUMN "content" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isUploaded" BOOLEAN NOT NULL DEFAULT false;
