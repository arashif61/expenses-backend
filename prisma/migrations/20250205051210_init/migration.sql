/*
  Warnings:

  - You are about to drop the column `amount` on the `account` table. All the data in the column will be lost.
  - Added the required column `debit_approval_no` to the `debit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "account" DROP COLUMN "amount",
ADD COLUMN     "debit_approval_no" BIGINT,
ADD COLUMN     "deposit_amount" BIGINT,
ADD COLUMN     "withdraw_amount" BIGINT;

-- AlterTable
ALTER TABLE "debit" ADD COLUMN     "debit_approval_no" BIGINT NOT NULL;
