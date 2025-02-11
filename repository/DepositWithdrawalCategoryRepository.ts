import { PrismaClient } from "@prisma/client";

export class DepositWithdrawalCategoryRepository {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async select(date: Date, content: string, amount: number | bigint) {
    const result = await this.prisma.depositWithdrawalCategory.findMany({ where: { depositWithdrawalDate: date, depositWithdrawalContent: content, depositWithdrawalAmount: amount } });
    await this.prisma.$disconnect();
    return result;
  }

  async selectByContent(content: string) {
    const result = await this.prisma.depositWithdrawalCategory.findFirst({ where: { depositWithdrawalContent: content }, orderBy: { depositWithdrawalDate: "desc" } });
    await this.prisma.$disconnect();
    return result;
  }

  async selectAll(dateFrom: Date, dateTo: Date) {
    const result = await this.prisma.depositWithdrawalCategory.findMany({ where: { depositWithdrawalDate: { gte: dateFrom, lt: dateTo } }, orderBy: [{ depositWithdrawalDate: "desc" }] });
    await this.prisma.$disconnect();
    return result;
  }

  async update(id: number | bigint, categoryId: number | bigint) {
    await this.prisma.depositWithdrawalCategory.update({ where: { id: id }, data: { categoryId: categoryId } });
    await this.prisma.$disconnect();
  }

  async insert(date: Date, content: string, amount: number | bigint, categoryId: number | bigint) {
    await this.prisma.depositWithdrawalCategory.create({ data: { depositWithdrawalDate: date, depositWithdrawalContent: content, depositWithdrawalAmount: amount, categoryId: categoryId } });
    await this.prisma.$disconnect();
  }

  async insertMany(objects: any) {
    await this.prisma.depositWithdrawalCategory.createMany({ data: objects });
    await this.prisma.$disconnect();
  }
}

export default DepositWithdrawalCategoryRepository;
