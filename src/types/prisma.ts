import { Prisma } from "../../generated/prisma/client";

export type JobWithTechsAndHistory = Prisma.JobGetPayload<{
  include: {
    techsRequired: {
      include: {
        tech: true;
      };
    };
    jobHistory: true;
  };
}>;
