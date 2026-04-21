import { prisma } from "../lib/prisma";
import { PrismaJob } from "../repositories/prisma/prismaJob.repository";
import { PrismaTech } from "../repositories/prisma/prismaTech.repository";
import { PrismaUser } from "../repositories/prisma/prismaUser.repository";
import { JobService } from "./job.service";
import { TechService } from "./tech.service";
import { UserService } from "./user.service";

export function createServices() {
  return {
    userService: new UserService(new PrismaUser(prisma)),
    jobService: new JobService(new PrismaJob(prisma)),
    techService: new TechService(new PrismaTech(prisma)),
  };
}

export type Services = ReturnType<typeof createServices>;
