/*
  Warnings:

  - You are about to drop the column `accept_marketing_from` on the `consumers` table. All the data in the column will be lost.
  - You are about to drop the column `disabled_from` on the `senders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "consumers" DROP COLUMN "accept_marketing_from",
ADD COLUMN     "accept_marketing_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "senders" DROP COLUMN "disabled_from",
ADD COLUMN     "disabled_at" TIMESTAMP(3);
