/*
  Warnings:

  - Added the required column `fileName` to the `Dataset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dataset" ADD COLUMN     "fileName" TEXT NOT NULL;
