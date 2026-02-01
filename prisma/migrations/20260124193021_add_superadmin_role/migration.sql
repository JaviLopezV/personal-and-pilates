-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SUPERADMIN';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "disabled" BOOLEAN NOT NULL DEFAULT false;
