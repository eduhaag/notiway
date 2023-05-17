/*
  Warnings:

  - Added the required column `type` to the `user_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('PASSWORD_RESET', 'MAIL_CONFIRM');

-- AlterTable
ALTER TABLE "user_tokens" ADD COLUMN     "type" "TokenType" NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "mail_confirm_at" TIMESTAMP(3);
