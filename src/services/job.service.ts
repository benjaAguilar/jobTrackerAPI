import { Job } from "../../generated/prisma/client";
import { JobState } from "../../generated/prisma/enums";
import { JobRepository } from "../repositories/job.repository";

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

  async getJobs(userId: number, state: JobState | undefined): Promise<Job[]> {
    const enums: JobState[] = ["offer", "applied", "interview", "rejected"];
    const [isValidEnum] = enums.filter((enu) => state === enu);

    return this.jobRepo.getJobs(userId, isValidEnum);
  }
}
