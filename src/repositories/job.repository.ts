import { Job } from "../../generated/prisma/client";
import { JobState } from "../../generated/prisma/enums";
import { JobWithTechs } from "../types/prisma";

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

  getJobById(jobId: number): Promise<JobWithTechs | null>;

  updateJob(
    jobId: number,
    userId: number,
    data: {
      vacantName: string;
      company: string;
      notes?: string;
      rejectionReason?: string;
      techs: number[];
      state: JobState;
    },
  ): Promise<Job>;

  deleteJob(jobId: number, userId: number): Promise<Job>;
}
