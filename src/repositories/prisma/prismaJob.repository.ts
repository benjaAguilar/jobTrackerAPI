import {
  Job,
  JobHistory,
  JobState,
  PrismaClient,
} from "../../../generated/prisma/client";
import { JobWithHistory, JobWithTechsAndHistory } from "../../types/prisma";
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
        jobHistory: {
          create: { state: data.state },
        },
      },
    });
  }

  getJobById(jobId: number): Promise<JobWithTechsAndHistory | null> {
    return this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        techsRequired: {
          include: {
            tech: true,
          },
        },
        jobHistory: true,
      },
    });
  }

  getJobs(userId: number, state: JobState | undefined): Promise<Job[]> {
    return this.prisma.job.findMany({
      where: { state: state, user_id: userId },
      include: {
        techsRequired: {
          include: {
            tech: true,
          },
        },
        jobHistory: true,
      },
    });
  }

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
  ): Promise<Job> {
    return this.prisma.job.update({
      where: { id: jobId, user_id: userId },
      data: {
        vacantName: data.vacantName,
        company: data.company,
        notes: data.notes,
        rejectionReason: data.rejectionReason,
        state: data.state,
        techsRequired: {
          deleteMany: {},
          create: data.techs.map((techId) => ({ tech_id: techId })),
        },
      },
    });
  }

  deleteJob(jobId: number, userId: number): Promise<Job> {
    return this.prisma.job.delete({ where: { id: jobId, user_id: userId } });
  }

  removeHistoryEntry(historyId: number): Promise<JobHistory> {
    return this.prisma.jobHistory.delete({ where: { id: historyId } });
  }

  addHistoryEntry(jobId: number, state: JobState): Promise<JobHistory> {
    return this.prisma.jobHistory.create({
      data: {
        job_id: jobId,
        state: state,
      },
    });
  }

  getEvents(
    userId: number,
    state: JobState,
    containState: JobState,
    initDate: Date,
    endDate: Date,
    noneState?: JobState,
  ): Promise<JobWithHistory[]> {
    const none = noneState
      ? {
          none: {
            state: noneState,
          },
        }
      : {};

    return this.prisma.job.findMany({
      where: {
        user_id: userId,
        AND: [
          {
            jobHistory: {
              some: {
                state: state,
                timestamp: {
                  gte: initDate,
                  lte: endDate,
                },
              },
              ...none,
            },
          },
          {
            jobHistory: {
              some: {
                state: containState,
              },
            },
          },
        ],
      },
      include: {
        jobHistory: true,
      },
    });
  }
}
