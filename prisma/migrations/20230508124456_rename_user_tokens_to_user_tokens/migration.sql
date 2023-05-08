/*
  Warnings:

  - You are about to drop the `UserTokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserTokens" DROP CONSTRAINT "UserTokens_user_id_fkey";

-- DropTable
DROP TABLE "UserTokens";

-- CreateTable
CREATE TABLE "user_tokens" (
    "id" TEXT NOT NULL,
    "expires_date" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "user_tokens_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_tokens" ADD CONSTRAINT "user_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
