import { PrismaClient } from "@prisma/client";

export class CategoryRepository {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async selectAll() {
    const result = await this.prisma.category.findMany({ orderBy: [{ id: "asc" }] });
    await this.prisma.$disconnect();
    return result;
  }

  async select(id: number | bigint) {
    const result = await this.prisma.category.findMany({ where: { id: id }, orderBy: [{ id: "asc" }] });
    await this.prisma.$disconnect();
    return result;
  }

  async selectInitCategory() {
    const result = await this.prisma.category.findFirst({ where: { isInitCategory: true }, orderBy: [{ id: "asc" }] });
    await this.prisma.$disconnect();
    return result;
  }

  async update(id: number | bigint, name: string, color: string, icon: string) {
    await this.prisma.category.update({ where: { id: id }, data: { name: name, color: color, icon: icon } });
    await this.prisma.$disconnect();
  }

  async insert(name: string, color: string, icon: string) {
    await this.prisma.category.create({ data: { name: name, color: color, icon: icon } });
    await this.prisma.$disconnect();
  }

  async insertMany(objects: any) {
    await this.prisma.category.createMany({ data: objects });
    await this.prisma.$disconnect();
  }
}

export default CategoryRepository;
