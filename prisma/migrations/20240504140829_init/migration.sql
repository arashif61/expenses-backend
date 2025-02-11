/*
  Warnings:

  - Added the required column `csv_row_no` to the `account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `csv_row_no` to the `debit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `desc_no` to the `deposit_withdrawal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "account" ADD COLUMN     "csv_row_no" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "debit" ADD COLUMN     "csv_row_no" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "deposit_withdrawal" ADD COLUMN     "desc_no" BIGINT NOT NULL;
