/*
  Warnings:

  - You are about to drop the column `accept_marketing_at` on the `consumers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "consumers" DROP COLUMN "accept_marketing_at",
ADD COLUMN     "marketing_agree_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
