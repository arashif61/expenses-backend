import { PrismaClient } from "@prisma/client";

export class DebitRepository {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async selectByDebitApprovalNo(debitApprovalNo: number | bigint) {
    const result = await this.prisma.debit.findFirst({ where: { debitApprovalNo: debitApprovalNo } });
    await this.prisma.$disconnect();
    return result;
  }

  async insert(date: Date, content: string, debitApprovalNo: number | bigint, amount: number | bigint, csvRowNo: number | bigint) {
    await this.prisma.debit.create({ data: { date: date, content: content, debitApprovalNo: debitApprovalNo, amount: amount, csvRowNo: csvRowNo } });
    await this.prisma.$disconnect();
  }

  async insertMany(objects: any) {
    await this.prisma.debit.createMany({ data: objects });
    await this.prisma.$disconnect();
  }

  async deleteByDate(dateFrom: Date, dateTo: Date) {
    await this.prisma.debit.deleteMany({ where: { date: { gte: dateFrom, lt: dateTo } } });
    await this.prisma.$disconnect();
  }
}

export default DebitRepository;
