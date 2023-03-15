-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_consumer_id_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "consumer_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "consumers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
