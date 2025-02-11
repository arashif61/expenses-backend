/*
  Warnings:

  - You are about to drop the `expense_category` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `icon` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `deposit_withdrawal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "expense_category" DROP CONSTRAINT "expense_category_categoryId_fkey";

-- AlterTable
ALTER TABLE "category" ADD COLUMN     "icon" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "deposit_withdrawal" ADD COLUMN     "account_id" BIGINT,
ADD COLUMN     "debit_id" BIGINT,
ADD COLUMN     "source" TEXT NOT NULL;

-- DropTable
DROP TABLE "expense_category";

-- CreateTable
CREATE TABLE "deposit_withdrawal_category" (
    "id" BIGSERIAL NOT NULL,
    "deposit_withdrawal_date" TEXT NOT NULL,
    "deposit_withdrawal_content" TEXT NOT NULL,
    "deposit_withdrawal_amount" BIGINT NOT NULL,
    "category_id" BIGINT NOT NULL,

    CONSTRAINT "deposit_withdrawal_category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "deposit_withdrawal" ADD CONSTRAINT "deposit_withdrawal_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposit_withdrawal" ADD CONSTRAINT "deposit_withdrawal_debit_id_fkey" FOREIGN KEY ("debit_id") REFERENCES "debit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposit_withdrawal_category" ADD CONSTRAINT "deposit_withdrawal_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
