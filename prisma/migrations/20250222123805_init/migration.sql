-- CreateTable
CREATE TABLE "account" (
    "id" BIGSERIAL NOT NULL,
    "date" DATE NOT NULL,
    "content" TEXT NOT NULL,
    "debit_approval_no" BIGINT,
    "withdraw_amount" BIGINT,
    "deposit_amount" BIGINT,
    "balance" BIGINT NOT NULL,
    "csv_row_no" BIGINT NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "debit" (
    "id" BIGSERIAL NOT NULL,
    "date" DATE NOT NULL,
    "content" TEXT NOT NULL,
    "debit_approval_no" BIGINT NOT NULL,
    "amount" BIGINT NOT NULL,
    "csv_row_no" BIGINT NOT NULL,

    CONSTRAINT "debit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deposit_withdrawal" (
    "id" BIGSERIAL NOT NULL,
    "date" DATE NOT NULL,
    "content" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "account_id" BIGINT,
    "debit_id" BIGINT,
    "desc_no" BIGINT NOT NULL,

    CONSTRAINT "deposit_withdrawal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "isInitCategory" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deposit_withdrawal_category" (
    "id" BIGSERIAL NOT NULL,
    "deposit_withdrawal_date" DATE NOT NULL,
    "deposit_withdrawal_content" TEXT NOT NULL,
    "deposit_withdrawal_amount" BIGINT NOT NULL,
    "category_id" BIGINT NOT NULL,

    CONSTRAINT "deposit_withdrawal_category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "deposit_withdrawal" ADD CONSTRAINT "deposit_withdrawal_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposit_withdrawal" ADD CONSTRAINT "deposit_withdrawal_debit_id_fkey" FOREIGN KEY ("debit_id") REFERENCES "debit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposit_withdrawal_category" ADD CONSTRAINT "deposit_withdrawal_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
