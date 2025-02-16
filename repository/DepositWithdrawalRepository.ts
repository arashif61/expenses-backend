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

  async group(dateFrom: Date, dateTo: Date) {
    const result = await this.prisma.$queryRaw`
        select
          date_trunc('month',
          dw."date")::date as month,
          dwc.category_id,
          c."name" ,
          abs(sum(dw.amount)) amount
        from
          deposit_withdrawal dw
        inner join deposit_withdrawal_category dwc 
        on
          dwc.deposit_withdrawal_date = dw."date"
          and dwc.deposit_withdrawal_content = dw."content"
          and dwc.deposit_withdrawal_amount = dw.amount
        inner join category c 
          on
          c.id = dwc.category_id
        where
          dw.amount < 0
          and dw."date" >= ${dateFrom}
          and dw."date" < ${dateTo}
        group by
          date_trunc('month',
          dw."date")::date,
          dwc.category_id,
          c."name"
        order by 
          date_trunc('month',
          dw."date")::date asc,
          abs(sum(dw.amount))
    `;
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
