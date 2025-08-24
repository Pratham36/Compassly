/*
  Warnings:

  - You are about to drop the column `readability` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `strengths` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `suggestions` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `weaknesses` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - Added the required column `atsComment` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactScore` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `educationScore` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experienceScore` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overallFeedback` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overallScore` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skillsScore` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summaryComment` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ResumeAnalysis" DROP COLUMN "readability",
DROP COLUMN "strengths",
DROP COLUMN "suggestions",
DROP COLUMN "weaknesses",
ADD COLUMN     "atsComment" TEXT NOT NULL,
ADD COLUMN     "contactScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "educationScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "experienceScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "keywordGaps" TEXT[],
ADD COLUMN     "keywordMatches" TEXT[],
ADD COLUMN     "needsImprovement" TEXT[],
ADD COLUMN     "overallFeedback" TEXT NOT NULL,
ADD COLUMN     "overallScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "skillsScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "summaryComment" TEXT NOT NULL,
ADD COLUMN     "tipsForImprovement" TEXT[],
ADD COLUMN     "whatsGood" TEXT[];
