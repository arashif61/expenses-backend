-- DropForeignKey
ALTER TABLE "deposit_withdrawal" DROP CONSTRAINT "deposit_withdrawal_account_id_fkey";

-- DropForeignKey
ALTER TABLE "deposit_withdrawal" DROP CONSTRAINT "deposit_withdrawal_debit_id_fkey";

-- AddForeignKey
ALTER TABLE "deposit_withdrawal" ADD CONSTRAINT "deposit_withdrawal_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposit_withdrawal" ADD CONSTRAINT "deposit_withdrawal_debit_id_fkey" FOREIGN KEY ("debit_id") REFERENCES "debit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
