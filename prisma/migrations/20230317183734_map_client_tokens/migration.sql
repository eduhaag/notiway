/*
  Warnings:

  - You are about to drop the `ClientTokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClientTokens" DROP CONSTRAINT "ClientTokens_client_id_fkey";

-- DropTable
DROP TABLE "ClientTokens";

-- CreateTable
CREATE TABLE "client_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "client_id" TEXT NOT NULL,

    CONSTRAINT "client_tokens_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "client_tokens" ADD CONSTRAINT "client_tokens_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
