/*
  Warnings:

  - You are about to drop the `expense` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "expense";

-- CreateTable
CREATE TABLE "deposit_withdrawal" (
    "id" BIGSERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,

    CONSTRAINT "deposit_withdrawal_pkey" PRIMARY KEY ("id")
);
