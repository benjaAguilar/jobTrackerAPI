import { PrismaClient, User } from "../../../generated/prisma/client";
import { UserRepository } from "../user.repository";

export class PrismaUser implements UserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  create(data: {
    username: string;
    password: string;
    email: string;
  }): Promise<User> {
    return this.prisma.user.create({ data });
  }
}
