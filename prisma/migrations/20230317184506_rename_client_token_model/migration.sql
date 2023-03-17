/*
  Warnings:

  - A unique constraint covering the columns `[client_id]` on the table `client_tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "client_tokens_client_id_key" ON "client_tokens"("client_id");
