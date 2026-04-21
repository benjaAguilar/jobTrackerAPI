import { PrismaClient, Tech } from "../../../generated/prisma/client";
import { TechRepository } from "../tech.repository";

export class PrismaTech implements TechRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createOrGet(techName: string): Promise<Tech> {
    return this.prisma.tech.upsert({
      where: { name: techName },
      update: {},
      create: { name: techName },
    });
  }
}
