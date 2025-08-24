-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "filename" TEXT,
ALTER COLUMN "content" DROP NOT NULL;
