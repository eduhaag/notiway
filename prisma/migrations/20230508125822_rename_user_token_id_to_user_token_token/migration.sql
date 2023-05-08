/*
  Warnings:

  - The primary key for the `user_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user_tokens` table. All the data in the column will be lost.
  - The required column `token` was added to the `user_tokens` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "user_tokens" DROP CONSTRAINT "user_tokens_pkey",
DROP COLUMN "id",
ADD COLUMN     "token" TEXT NOT NULL,
ADD CONSTRAINT "user_tokens_pkey" PRIMARY KEY ("token");
