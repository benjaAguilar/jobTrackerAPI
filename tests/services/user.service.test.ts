import { PrismaUser } from "../../src/repositories/prisma/prismaUser.repository";
import { UserService } from "../../src/services/user.service";

describe("UserService", () => {
  const prismaMock = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const userService = new UserService(new PrismaUser(prismaMock as any));

  describe("UserService.create()", () => {
    it("should create an user", async () => {
      prismaMock.user.create.mockResolvedValue({ id: 1 });

      const user = await userService.create({
        username: "asdasd",
        password: "123421312",
        email: "asdas",
      });

      expect(prismaMock.user.create).toHaveBeenCalled();
      expect(user).toEqual({ id: 1 });
    });

    it("should throw an error if the name is already taken", async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 1 });

      await expect(
        userService.create({
          username: "rick",
          email: "jondoe@lol.com",
          password: "12312312",
        }),
      ).rejects.toThrow("Username is already taken");
      expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(2);
    });
  });

  describe("UserService.get()", () => {
    it("should find an existing user with a valid username", async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 1 });

      const user = await userService.get("validUsername");

      expect(prismaMock.user.findUnique).toHaveBeenCalled();
      expect(user).toEqual({ id: 1 });
    });

    it("should find an existing user with a valid email", async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 4 });

      const user = await userService.get("valid@sername.as");

      expect(prismaMock.user.findUnique).toHaveBeenCalled();
      expect(user).toEqual({ id: 4 });
    });

    it("should throw an error if an user is not found", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      expect(userService.get("nonExistentUser")).rejects.toThrow(
        "User not found",
      );
    });
  });

  describe("UserService.getById()", () => {
    it("should find an existing user with a existing id", async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 1 });

      const user = await userService.getById(1);

      expect(prismaMock.user.findUnique).toHaveBeenCalled();
      expect(user).toEqual({ id: 1 });
    });

    it("should throw an error if an user is not found", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      expect(userService.getById(900)).rejects.toThrow("User not found");
    });
  });
});
