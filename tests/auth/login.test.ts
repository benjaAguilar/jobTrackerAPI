import request from "supertest";
import { app } from "../../src/app";
import { hashPassword } from "../../src/utils/bcrypt";

describe("POST /api/auth/login", () => {
  app.locals.services = {
    userService: {
      get: jest.fn(async () => {
        return {
          id: 2,
          username: "rick",
          password: await hashPassword("picklerick!"),
        };
      }),
      getById: jest.fn(() => {
        return { id: 2, username: "rick" };
      }),
    },
  };

  describe("success", () => {
    it("should login an user with valid data", async () => {
      const res = await request(app).post("/api/auth/login").send({
        usernameOrEmail: "rick",
        password: "picklerick!",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Logged in as rick");
    });
  });

  describe("Input Errors", () => {
    it("should give 400 if no Input is given", async () => {
      const res = await request(app).post("/api/auth/login");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("validation error");
      expect(res.body.fields).toBeDefined();
    });

    it("should give 400 if password is incorrect", async () => {
      const res = await request(app).post("/api/auth/login").send({
        usernameOrEmail: "rick",
        password: "incorrect",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Incorrect Password");
    });
  });
});
