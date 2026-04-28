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

export type JobWithHistory = Prisma.JobGetPayload<{
  include: {
    jobHistory: true;
  };
}>;
