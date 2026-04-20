import { PrismaClient, User } from "../../../generated/prisma/client";
import { CustomError } from "../../utils/customError";
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
      throw new CustomError("Username is already taken", 400);
    }

    if (userByEmail) {
      throw new CustomError("Email is already taken", 400);
    }

    return this.prisma.user.create({ data });
  }

  async get(usernameOrEmail: string): Promise<User> {
    const userArr = await Promise.all([
      this.prisma.user.findUnique({ where: { username: usernameOrEmail } }),
      this.prisma.user.findUnique({ where: { email: usernameOrEmail } }),
    ]);

    const [user] = userArr.filter((user) => user !== null);

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    return user;
  }

  async getById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: id } });

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    return user;
  }
}
