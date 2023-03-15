/*
  Warnings:

  - You are about to drop the `Consumer` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SendeType" AS ENUM ('SHARED', 'PRIVATE', 'EXCLUSIVE');

-- DropTable
DROP TABLE "Consumer";

-- CreateTable
CREATE TABLE "consumers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tax_id" TEXT,
    "email" TEXT NOT NULL,
    "fone" TEXT,
    "whatsapp" TEXT,
    "zip_code" TEXT,
    "street" TEXT,
    "number" TEXT,
    "complement" TEXT,
    "district" TEXT,
    "city" TEXT,
    "province" TEXT,
    "country" TEXT,
    "accept_marketing_from" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consumers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "access_level" INTEGER NOT NULL DEFAULT 10,
    "consumer_id" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "senders" (
    "id" TEXT NOT NULL,
    "api_token" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SendeType" NOT NULL,
    "company" TEXT,
    "last_recharge" TIMESTAMP(3),
    "disabled_from" TIMESTAMP(3),
    "national_code" INTEGER,
    "internacional_code" INTEGER,
    "region" TEXT,
    "full_number" TEXT NOT NULL,
    "consumer_id" TEXT,

    CONSTRAINT "senders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT DEFAULT 'processing',
    "header" TEXT,
    "footer" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "consumer_id" TEXT NOT NULL,
    "sender_id" TEXT,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "client_id" TEXT NOT NULL,

    CONSTRAINT "client_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "consumers_tax_id_key" ON "consumers"("tax_id");

-- CreateIndex
CREATE UNIQUE INDEX "consumers_email_key" ON "consumers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "senders_api_token_key" ON "senders"("api_token");

-- CreateIndex
CREATE UNIQUE INDEX "senders_name_key" ON "senders"("name");

-- CreateIndex
CREATE UNIQUE INDEX "senders_full_number_key" ON "senders"("full_number");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "consumers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "senders" ADD CONSTRAINT "senders_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "consumers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "consumers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "senders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_tokens" ADD CONSTRAINT "client_tokens_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
