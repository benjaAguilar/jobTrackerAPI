import { PrismaClient, User } from "../../../generated/prisma/client";
import { UserRepository } from "../user.repository";

export class PrismaUser implements UserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: {
    username: string;
    password: string;
    email: string;
  }): Promise<User> {
    const [userByUsername, userByEmail] = await Promise.all([
      this.prisma.user.findUnique({ where: { username: data.username } }),
      this.prisma.user.findUnique({ where: { email: data.email } }),
    ]);

    if (userByUsername) {
      throw new Error("Username is already taken");
    }

    if (userByEmail) {
      throw new Error("Email is already taken");
    }

    return this.prisma.user.create({ data });
  }
}
