/*
  Warnings:

  - You are about to drop the `client_tokens` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `token` to the `clients` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "client_tokens" DROP CONSTRAINT "client_tokens_client_id_fkey";

-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "token" TEXT NOT NULL;

-- DropTable
DROP TABLE "client_tokens";
