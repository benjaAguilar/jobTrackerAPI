import { Prisma } from "../../generated/prisma/client";

export type JobWithTechs = Prisma.JobGetPayload<{
  include: {
    techsRequired: {
      include: {
        tech: true;
      };
    };
  };
}>;
