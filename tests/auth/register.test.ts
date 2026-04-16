import request from "supertest";
import { app } from "../../src/app";

describe("POST /api/user/register", () => {
  app.locals.services = {
    userService: {
      create: jest.fn(() => console.log("RICKKSAKDKA")),
    },
  };

  describe("success", () => {
    it("should create an user with valid data", async () => {
      const res = await request(app).post("/api/user/register").send({
        username: "rick",
        email: "rick@sanchez.com",
        password: "picklerick!",
        r_password: "picklerick!",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("User rick registered");
    });
  });

  describe("input errors", () => {
    it("should return 400 if passwords do not match", async () => {
      const res = await request(app).post("/api/user/register").send({
        username: "rick",
        email: "rick@sanchez.com",
        password: "picklerickasd!",
        r_password: "picklerick!",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("validation error");
      expect(res.body.fields[0].msg).toBe("Passwords do not match");
    });

    it("should return 400 if email is not valid", async () => {
      const res = await request(app).post("/api/user/register").send({
        username: "rick",
        email: "ricks-anchez",
        password: "picklerick!",
        r_password: "picklerick!",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("validation error");
      expect(res.body.fields[0].msg).toBe("Use a valid email");
    });

    it("should return 400 if no input is given", async () => {
      const res = await request(app).post("/api/user/register");
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 if username is not alphanumeric", async () => {
      const res = await request(app).post("/api/user/register").send({
        username: "rick$$",
        email: "rick@sanchez.com",
        password: "picklerick!",
        r_password: "picklerick!",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("validation error");
      expect(res.body.fields[0].msg).toBe(
        "Username can only contain aplhanumeric caracters",
      );
    });
  });
});
