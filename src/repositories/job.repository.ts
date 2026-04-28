import { Job, JobHistory } from "../../generated/prisma/client";
import { JobState } from "../../generated/prisma/enums";
import { JobWithTechsAndHistory, JobWithHistory } from "../types/prisma";

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

  getJobById(jobId: number): Promise<JobWithTechsAndHistory | null>;

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

  removeHistoryEntry(historyId: number): Promise<JobHistory>;
  addHistoryEntry(jobId: number, state: JobState): Promise<JobHistory>;

  deleteJob(jobId: number, userId: number): Promise<Job>;

  getEvents(
    userId: number,
    state: JobState,
    containState: JobState,
    initDate: Date,
    endDate: Date,
    noneState?: JobState,
  ): Promise<JobWithHistory[]>;
}
