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

  getJobs(userId: number, state: JobState | undefined): Promise<Job[]>;

  getJobById(jobId: number): Promise<Job | null>;

  updateJob(
    jobId: number,
    userId: number,
    data: {
      vacantName: string;
      company: string;
      notes?: string;
      techs: number[];
      state: JobState;
      rejectionReason?: string;
    },
  ): Promise<Job>;
}
