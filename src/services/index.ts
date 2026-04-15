import { prisma } from "../lib/prisma";
import { PrismaUser } from "../repositories/prisma/prismaUser.repository";
import { UserService } from "./user.service";

export function createServices() {
  return {
    userService: new UserService(new PrismaUser(prisma)),
  };
}

export type Services = ReturnType<typeof createServices>;
