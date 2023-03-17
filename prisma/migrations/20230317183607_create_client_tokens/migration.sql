/*
  Warnings:

  - You are about to drop the column `token` on the `clients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "clients" DROP COLUMN "token";

-- CreateTable
CREATE TABLE "ClientTokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "client_id" TEXT NOT NULL,

    CONSTRAINT "ClientTokens_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClientTokens" ADD CONSTRAINT "ClientTokens_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
