import { PrismaClient } from "@prisma/client";

export class AccountRepository {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async selectByDate(dateFrom: Date, dateTo: Date) {
    const result = await this.prisma.account.findMany({ where: { date: { gte: dateFrom, lt: dateTo } } });
    await this.prisma.$disconnect();
    return result;
  }

  async selectLatestAccount() {
    const result = await this.prisma.account.findFirst({ orderBy: { date: "desc" } });
    await this.prisma.$disconnect();
    return result;
  }

  async insert(date: Date, content: string, debitApprovalNo: number | bigint, withdrawAmount: number | bigint, depositAmount: number | bigint, balance: number | bigint, csvRowNo: number | bigint) {
    await this.prisma.account.create({ data: { date: date, content: content, debitApprovalNo: debitApprovalNo, withdrawAmount: withdrawAmount, depositAmount: depositAmount, balance: balance, csvRowNo: csvRowNo } });
    await this.prisma.$disconnect();
  }

  async insertMany(objects: any) {
    await this.prisma.account.createMany({ data: objects });
    await this.prisma.$disconnect();
  }

  async deleteByDate(dateFrom: Date, dateTo: Date) {
    await this.prisma.account.deleteMany({ where: { date: { gte: dateFrom, lt: dateTo } } });
    await this.prisma.$disconnect();
  }
}

export default AccountRepository;
