import { Job } from "../../generated/prisma/client";
import { JobState } from "../../generated/prisma/enums";

export interface JobRepository {
  create(data: {
    vacantName: string;
    company: string;
    notes?: string;
    techs: number[];
    state: JobState;
    userId: number;
    rejectionReason?: string;
  }): Promise<Job>;
}
