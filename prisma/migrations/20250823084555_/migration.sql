/*
  Warnings:

  - You are about to drop the column `industryInsightId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_industryInsightId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "industryInsightId",
ADD COLUMN     "industry" TEXT;

-- CreateIndex
CREATE INDEX "IndustryInsight_industry_idx" ON "IndustryInsight"("industry");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_industry_fkey" FOREIGN KEY ("industry") REFERENCES "IndustryInsight"("industry") ON DELETE SET NULL ON UPDATE CASCADE;
