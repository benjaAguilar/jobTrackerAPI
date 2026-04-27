import { JobRepository } from "../../src/repositories/job.repository";
import { JobService } from "../../src/services/job.service";
import { JobWithTechs } from "../../src/types/prisma";

const createMockJob = (overrides?: Partial<JobWithTechs>): JobWithTechs => ({
  id: 1,
  vacantName: "test",
  company: "test",
  notes: null,
  state: "offer",
  rejectionReason: null,
  user_id: 1,
  techsRequired: [],
  ...overrides,
});
const repoMock: jest.Mocked<JobRepository> = {
  getJobById: jest.fn(async (id) => createMockJob({ id: id, user_id: 9 })),
  create: jest.fn(),
  getJobs: jest.fn(),
  updateJob: jest.fn(async (_jobId, _userId, data) => {
    const { techs, ...mockData } = data;
    return createMockJob(mockData);
  }),
  deleteJob: jest.fn(async (id, _userId) => createMockJob({ id: id })),
};
const jobService = new JobService(repoMock);

describe("JobService", () => {
  describe("JobService.create()", () => {
    it("should create an user", async () => {
      repoMock.create.mockImplementationOnce(async () =>
        createMockJob({ id: 5 }),
      );

      const job = await jobService.create({
        vacantName: "web dev",
        company: "adult swim",
        state: "applied",
        techs: [1, 2],
        userId: 3,
      });

      expect(job).toEqual(createMockJob({ id: 5 }));
    });

    it("should receive the correct params", async () => {
      await jobService.create({
        vacantName: "web dev",
        company: "adult swim",
        state: "applied",
        techs: [1],
        userId: 3,
      });

      expect(repoMock.create).toHaveBeenCalledWith({
        vacantName: "web dev",
        company: "adult swim",
        state: "applied",
        techs: [1],
        userId: 3,
      });
    });
  });

  describe("JobService.getJobs()", () => {
    it("should return an array of jobs", async () => {
      repoMock.getJobs.mockImplementationOnce(async () => [
        createMockJob(),
        createMockJob({ id: 3 }),
      ]);

      const jobs = await jobService.getJobs(1, "applied");

      expect(jobs).toEqual([createMockJob(), createMockJob({ id: 3 })]);
    });

    it("is filtering by job state", async () => {
      await jobService.getJobs(1, "rejected");

      expect(repoMock.getJobs).toHaveBeenCalledWith(1, "rejected");
    });

    it("if state is invalid should pass undefined as parameter", async () => {
      await jobService.getJobs(1, "noValid");

      expect(repoMock.getJobs).toHaveBeenCalledWith(1, undefined);
    });

    it("if state is undefined should pass undefined as parameter", async () => {
      await jobService.getJobs(1, undefined);

      expect(repoMock.getJobs).toHaveBeenCalledWith(1, undefined);
    });
  });

  describe("JobService.getJobById()", () => {
    it("should return a job", async () => {
      repoMock.getJobById.mockImplementationOnce(async () =>
        createMockJob({ id: 20 }),
      );

      const job = await jobService.getJobById(20);

      expect(job).toEqual(createMockJob({ id: 20 }));
    });

    it("recieves the correct params", async () => {
      await jobService.getJobById(20);

      expect(repoMock.getJobById).toHaveBeenCalledWith(20);
    });
  });

  describe("JobService.updateJob()", () => {
    it("should return an updated a job", async () => {
      const updatedJob = await jobService.updateJob(3, 9, {
        vacantName: "devops",
        company: "pea",
        state: "applied",
        techs: [1, 5, 13],
      });

      expect(updatedJob).toEqual(
        createMockJob({
          vacantName: "devops",
          company: "pea",
          state: "applied",
        }),
      );
    });

    it("should be capable to edit the optional notes", async () => {
      const updatedJob = await jobService.updateJob(3, 9, {
        vacantName: "devops",
        company: "pea",
        state: "applied",
        techs: [1, 5, 13],
        notes: "im rick note",
      });

      expect(updatedJob).toEqual(
        createMockJob({
          vacantName: "devops",
          company: "pea",
          state: "applied",
          notes: "im rick note",
        }),
      );
    });

    it("should be capable to update rejectionReason when state is rejected", async () => {
      const updatedJob = await jobService.updateJob(3, 9, {
        vacantName: "devops",
        company: "pea",
        state: "rejected",
        techs: [1, 5, 13],
        rejectionReason: "im too fat",
        notes: "im rick note",
      });

      expect(updatedJob).toEqual(
        createMockJob({
          vacantName: "devops",
          company: "pea",
          state: "rejected",
          rejectionReason: "im too fat",
          notes: "im rick note",
        }),
      );
    });

    it("should default rejectionReason to undefined if has a value and state != rejected", async () => {
      const job = await jobService.updateJob(3, 9, {
        vacantName: "devops",
        company: "pea",
        state: "applied",
        techs: [1, 5, 13],
        rejectionReason: "im too fat",
        notes: "im rick note",
      });

      expect(job).toEqual(
        createMockJob({
          vacantName: "devops",
          company: "pea",
          state: "applied",
          rejectionReason: undefined,
          notes: "im rick note",
        }),
      );
    });

    it("should throw an error if job.user_id does not match with the given userId", async () => {
      expect(
        jobService.updateJob(3, 5, {
          vacantName: "devops",
          company: "pea",
          state: "applied",
          techs: [1, 5, 13],
        }),
      ).rejects.toThrow("Unauthorized to edit this job");
    });

    it("should throw an error if jobId given does not belong to a job", async () => {
      repoMock.getJobById.mockImplementationOnce(async () => null);

      expect(
        jobService.updateJob(900, 5, {
          vacantName: "devops",
          company: "pea",
          state: "applied",
          techs: [1, 5, 13],
        }),
      ).rejects.toThrow("Job not found");
    });
  });

  describe("JobService.deleteJob()", () => {
    it("Should return the deleted Job", async () => {
      const res = await jobService.deleteJob(5, 9);
      expect(res).toEqual(createMockJob({ id: 5 }));
    });

    it("Should recieve correct param id", async () => {
      await jobService.deleteJob(15, 9);
      expect(repoMock.deleteJob).toHaveBeenCalledWith(15, 9);
    });

    it("should throw an error if jobId given does not exist", async () => {
      repoMock.getJobById.mockImplementationOnce(async () => null);
      expect(jobService.deleteJob(3, 9)).rejects.toThrow("Job not found");
    });

    it("should throw an error if job.user_id does not match with the given userId", async () => {
      expect(jobService.deleteJob(3, 5)).rejects.toThrow(
        "Unauthorized to delete this job",
      );
    });
  });
});
