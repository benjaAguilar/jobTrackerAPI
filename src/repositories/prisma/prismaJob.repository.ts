import { Job, JobState, PrismaClient } from "../../../generated/prisma/client";
import { JobRepository } from "../job.repository";

export class PrismaJob implements JobRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  create(data: {
    vacantName: string;
    company: string;
    notes?: string;
    techs: number[];
    state: JobState;
    userId: number;
    rejectionReason?: string;
  }): Promise<Job> {
    return this.prisma.job.create({
      data: {
        vacantName: data.vacantName,
        company: data.company,
        notes: data.notes,
        state: data.state,
        user_id: data.userId,
        rejectionReason: data.rejectionReason,
        techsRequired: {
          create: data.techs.map((techId) => ({ tech_id: techId })),
        },
      },
    });
  }

  getJobById(jobId: number): Promise<Job | null> {
    return this.prisma.job.findUnique({
      where: { id: jobId },
    });
  }

  getJobs(userId: number, state: JobState | undefined): Promise<Job[]> {
    return this.prisma.job.findMany({
      where: { state: state, user_id: userId },
    });
  }

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
  ): Promise<Job> {
    return this.prisma.job.update({
      where: { id: jobId, user_id: userId },
      data: {
        vacantName: data.vacantName,
        company: data.company,
        notes: data.notes,
        state: data.state,
        rejectionReason: data.rejectionReason,
        techsRequired: {
          create: data.techs.map((techId) => ({ tech_id: techId })),
        },
      },
    });
  }
}
