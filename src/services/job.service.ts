import { Job } from "../../generated/prisma/client";
import { JobState } from "../../generated/prisma/enums";
import { JobRepository } from "../repositories/job.repository";
import { JobWithTechs } from "../types/prisma";
import { CustomError } from "../utils/customError";

export class JobService implements JobRepository {
  private jobRepo: JobRepository;

  constructor(jobRepo: JobRepository) {
    this.jobRepo = jobRepo;
  }

  async create(data: {
    vacantName: string;
    company: string;
    notes?: string;
    techs: number[];
    state: JobState;
    userId: number;
    rejectionReason?: string;
  }): Promise<Job> {
    return this.jobRepo.create(data);
  }

  async getJobs(
    userId: number,
    state: JobState | undefined | string,
  ): Promise<Job[]> {
    const enums: JobState[] = ["offer", "applied", "interview", "rejected"];
    const [isValidEnum] = enums.filter((enu) => state === enu);

    return this.jobRepo.getJobs(userId, isValidEnum);
  }

  async getJobById(jobId: number): Promise<JobWithTechs | null> {
    return this.jobRepo.getJobById(jobId);
  }

  async updateJob(
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
  ): Promise<Job> {
    const job = await this.jobRepo.getJobById(jobId);

    if (!job) throw new CustomError("Job not found", 404);
    if (job.user_id !== userId) {
      throw new CustomError("Unauthorized to edit this job", 401);
    }

    // instead of throw an error we can just set rejectionReason to undefined;
    if (data.state !== "rejected" && data.rejectionReason)
      data.rejectionReason = undefined;

    return this.jobRepo.updateJob(jobId, userId, data);
  }

  async deleteJob(jobId: number, userId: number): Promise<Job> {
    const job = await this.jobRepo.getJobById(jobId);
    console.log(job);

    if (!job) throw new CustomError("Job not found", 404);
    if (job.user_id !== userId) {
      throw new CustomError("Unauthorized to delete this job", 401);
    }
    return this.jobRepo.deleteJob(jobId, userId);
  }
}
