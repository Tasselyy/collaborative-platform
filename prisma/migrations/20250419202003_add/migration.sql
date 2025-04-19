/*
  Warnings:

  - You are about to drop the `_TeamMembership` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TeamRole" AS ENUM ('OWNER', 'MEMBER');

-- DropForeignKey
ALTER TABLE "_TeamMembership" DROP CONSTRAINT "_TeamMembership_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeamMembership" DROP CONSTRAINT "_TeamMembership_B_fkey";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Visualization" ADD COLUMN     "description" TEXT;

-- DropTable
DROP TABLE "_TeamMembership";

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "TeamRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_teamId_userId_key" ON "TeamMember"("teamId", "userId");

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
