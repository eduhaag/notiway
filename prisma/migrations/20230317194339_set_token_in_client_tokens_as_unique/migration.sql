/*
  Warnings:

  - The primary key for the `client_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `client_tokens` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "client_tokens" DROP CONSTRAINT "client_tokens_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "client_tokens_pkey" PRIMARY KEY ("id");
