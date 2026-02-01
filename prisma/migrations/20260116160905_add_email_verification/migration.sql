-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "oauthProvider" TEXT,
ADD COLUMN     "oauthSubject" TEXT,
ADD COLUMN     "verifyTokenExp" TIMESTAMP(3),
ADD COLUMN     "verifyTokenHash" TEXT;
