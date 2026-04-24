import { Job } from "../../generated/prisma/client";
import { JobRepository } from "../../src/repositories/job.repository";
import { JobService } from "../../src/services/job.service";

const createMockJob = (overrides?: Partial<Job>): Job => ({
  id: 1,
  vacantName: "test",
  company: "test",
  notes: null,
  state: "offer",
  rejectionReason: null,
  user_id: 1,
  ...overrides,
});
const repoMock: jest.Mocked<JobRepository> = {
  getJobById: jest.fn(),
  create: jest.fn(),
  getJobs: jest.fn(),
  updateJob: jest.fn(),
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
});
