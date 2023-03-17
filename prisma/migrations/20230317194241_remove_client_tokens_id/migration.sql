/*
  Warnings:

  - The primary key for the `client_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `client_tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `client_tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "client_tokens" DROP CONSTRAINT "client_tokens_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "client_tokens_pkey" PRIMARY KEY ("token");

-- CreateIndex
CREATE UNIQUE INDEX "client_tokens_token_key" ON "client_tokens"("token");
