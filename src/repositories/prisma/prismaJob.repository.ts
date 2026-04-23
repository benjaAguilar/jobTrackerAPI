import { Job, JobState, PrismaClient } from "../../../generated/prisma/client";
import { JobRepository } from "../job.repository";

export class PrismaJob implements JobRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
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

  async getJobs(userId: number, state: JobState | undefined): Promise<Job[]> {
    return this.prisma.job.findMany({
      where: { state: state, user_id: userId },
    });
  }
}
