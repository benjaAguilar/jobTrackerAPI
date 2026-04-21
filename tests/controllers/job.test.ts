import request from "supertest";
import { app } from "../../src/app";
import { Request, Response, Next } from "../../src/types/express";
import { jwtAuthStrategy } from "../../src/middlewares/passport";

jest.mock("../../src/middlewares/passport.ts", () => ({
  jwtAuthStrategy: jest.fn(() => console.log("asdasd")),
}));

app.locals.services = {
  jobService: {
    create: jest.fn(),
  },
  techService: {
    createOrGet: jest.fn(() => ({
      id: Math.floor(Math.random() * (50 - 1) + 1),
    })),
  },
};

describe("POST /api/job/create", () => {
  describe("auth fail", () => {
    it("throws a 401 if user is not authenticated", async () => {
      (jwtAuthStrategy as jest.Mock).mockImplementationOnce(
        (_req: Request, res: Response) => {
          return res.status(401).json({ message: "Unauthorized" });
        },
      );

      const res = await request(app).post("/api/job/create");
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Unauthorized");
    });
  });
  describe("success cases", () => {
    it("should give 200 with message job created being auth", async () => {
      (jwtAuthStrategy as jest.Mock).mockImplementation(
        (req: Request, _res: Response, next: Next) => {
          req.user = { id: 1, username: "rick" };
          next();
        },
      );

      const res = await request(app).post("/api/job/create").send({
        vacantName: "epic jobb",
        company: "EviL",
        notes: "im scared of jobs",
        state: "applied",
        techs: '["react", "css"]',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Job created");
    });

    it("should call and create a new job", async () => {
      const res = await request(app).post("/api/job/create").send({
        vacantName: "epic jobb",
        company: "EviL",
        notes: "im scared of jobs",
        state: "applied",
        techs: '["react", "css"]',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Job created");
      expect(app.locals.services.jobService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("input validation", () => {
    it("should give a validation error if no input is given", async () => {
      const res = await request(app).post("/api/job/create");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("validation error");
    });

    it("if no input is given on techs, techs default should be ['other']", async () => {
      const res = await request(app).post("/api/job/create").send({
        vacantName: "epic jobb",
        company: "EviL",
        notes: "im scared of jobs",
        state: "applied",
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("if no notes are given should give 200 anyways", async () => {
      const res = await request(app).post("/api/job/create").send({
        vacantName: "epic jobb",
        company: "EviL",
        state: "applied",
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("if invalid state is given shold throw 400", async () => {
      const res = await request(app).post("/api/job/create").send({
        vacantName: "epic jobb",
        company: "EviL",
        state: "invalid state",
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("validation error");
      expect(res.body.fields[0].msg).toBe("Please provide a valid job state");
    });
  });
});
