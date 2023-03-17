/*
  Warnings:

  - You are about to drop the column `created_at` on the `client_tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "client_tokens" DROP COLUMN "created_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
