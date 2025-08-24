/*
  Warnings:

  - You are about to drop the column `atsScore` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `feedback` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `industry` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_industry_fkey";

-- DropIndex
DROP INDEX "IndustryInsight_industry_idx";

-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "atsScore",
DROP COLUMN "feedback";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bio",
DROP COLUMN "experience",
DROP COLUMN "industry",
DROP COLUMN "skills",
ADD COLUMN     "industryInsightId" TEXT;

-- CreateTable
CREATE TABLE "ResumeAnalysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "strengths" TEXT[],
    "weaknesses" TEXT[],
    "atsScore" DOUBLE PRECISION NOT NULL,
    "readability" TEXT NOT NULL,
    "suggestions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResumeAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResumeAnalysis_userId_key" ON "ResumeAnalysis"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_industryInsightId_fkey" FOREIGN KEY ("industryInsightId") REFERENCES "IndustryInsight"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumeAnalysis" ADD CONSTRAINT "ResumeAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
