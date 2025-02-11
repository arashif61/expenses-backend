import { PrismaClient } from "@prisma/client";

export class DepositWithdrawalRepository {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async selectByDate(dateFrom: Date, dateTo: Date) {
    const result = await this.prisma.depositWithdrawal.findMany({ where: { date: { gte: dateFrom, lt: dateTo } }, orderBy: [{ date: "desc" }, { descNo: "asc" }] });
    await this.prisma.$disconnect();
    return result;
  }

  async selectYearMonth() {
    const result = await this.prisma.depositWithdrawal.findMany({ select: { date: true }, orderBy: { date: "desc" }, distinct: ["date"] });
    await this.prisma.$disconnect();
    return result;
  }

  async insert(date: Date, content: string, amount: number | bigint, accountId: number | bigint, debitId: number | bigint, descNo: number | bigint) {
    await this.prisma.depositWithdrawal.create({ data: { date: date, content: content, amount: amount, accountId: accountId, debitId: debitId, descNo: descNo } });
    await this.prisma.$disconnect();
  }

  async insertMany(objects: any) {
    await this.prisma.depositWithdrawal.createMany({ data: objects });
    await this.prisma.$disconnect();
  }

  async deleteByDate(dateFrom: Date, dateTo: Date) {
    await this.prisma.depositWithdrawal.deleteMany({ where: { date: { gte: dateFrom, lt: dateTo } } });
    await this.prisma.$disconnect();
  }
}

export default DepositWithdrawalRepository;
