-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('UPLOADED', 'NEEDS_REVIEW', 'VALIDATED', 'REJECTED');

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'UPLOADED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);
