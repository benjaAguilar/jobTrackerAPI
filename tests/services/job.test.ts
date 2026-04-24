import { JobState } from "../../generated/prisma/enums";
import { PrismaJob } from "../../src/repositories/prisma/prismaJob.repository";
import { JobService } from "../../src/services/job.service";

describe("JobService", () => {
  const prismaMock = {
    job: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  const dbService = new PrismaJob(prismaMock as any);
  const jobService = new JobService(dbService);

  //TODO: we should decople jobService with PrismaJob
  //what happens if one deay we change prisma for another ORM?
  //all services that are copled with prisma gonna fail
  //HACK: JUST TEST THE LOGIC OF JobService

  describe("JobService.create()", () => {
    it("should create an user", async () => {
      // a mi no me interesa o no se lo que hay despues de jobService
      // yo solo se que si llamo jobService.create() me devuelve un usuario
      prismaMock.job.create.mockResolvedValue({ id: 1 });

      const job = await jobService.create({
        vacantName: "web dev",
        company: "adult swim",
        state: "applied",
        techs: [1, 2],
        userId: 3,
      });

      expect(job).toEqual({ id: 1 });
    });

    it("should receive the correct params", async () => {
      dbService.create = jest.fn();

      await jobService.create({
        vacantName: "web dev",
        company: "adult swim",
        state: "applied",
        techs: [1],
        userId: 3,
      });

      expect(dbService.create).toHaveBeenCalledWith({
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
      prismaMock.job.findMany.mockResolvedValue([{ id: 3 }, { id: 6 }]);

      const jobs = await jobService.getJobs(1, "applied");

      expect(jobs).toEqual([{ id: 3 }, { id: 6 }]);
    });

    it("is filtering by job state", async () => {
      dbService.getJobs = jest.fn();

      await jobService.getJobs(1, "rejected");

      expect(dbService.getJobs).toHaveBeenCalledWith(1, "rejected");
    });

    it("if state is invalid should pass undefined as parameter", async () => {
      await jobService.getJobs(1, "noValid");

      expect(dbService.getJobs).toHaveBeenCalledWith(1, undefined);
    });

    it("if state is undefined should pass undefined as parameter", async () => {
      await jobService.getJobs(1, undefined);

      expect(dbService.getJobs).toHaveBeenCalledWith(1, undefined);
    });
  });
});
