/*
  Warnings:

  - Changed the type of `deposit_withdrawal_date` on the `deposit_withdrawal_category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "deposit_withdrawal_category" DROP COLUMN "deposit_withdrawal_date",
ADD COLUMN     "deposit_withdrawal_date" TIMESTAMP(3) NOT NULL;
