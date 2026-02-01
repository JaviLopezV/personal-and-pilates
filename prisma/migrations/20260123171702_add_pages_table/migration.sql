-- CreateEnum
CREATE TYPE "PageStatus" AS ENUM ('ACTIVE', 'UNDER_CONSTRUCTION', 'INACTIVE');

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "name" TEXT,
    "status" "PageStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Page_path_key" ON "Page"("path");

-- CreateIndex
CREATE INDEX "Page_status_idx" ON "Page"("status");
