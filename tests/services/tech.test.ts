import { TechRepository } from "../../src/repositories/tech.repository";
import { TechService } from "../../src/services/tech.service";

const mockRepo: jest.Mocked<TechRepository> = {
  createOrGet: jest.fn(async (tech: string) => ({
    // we use tech.length to simulate diferent ids
    id: tech.length,
    name: tech,
  })),
};
const techService = new TechService(mockRepo);

describe("TechService", () => {
  describe("TechService.createOrGet()", () => {
    it("should return a tech", async () => {
      const tech = await techService.createOrGet("javascript");
      expect(tech).toEqual({ id: 10, name: "javascript" });
    });

    it("should receive a string as a param", async () => {
      await techService.createOrGet("php");
      expect(mockRepo.createOrGet).toHaveBeenCalledWith("php");
    });
  });

  describe("TechService.createOrGetMultipleTechs()", () => {
    it("should return an array of techs ids", async () => {
      const arr = await techService.createOrGetMultipleTechs(
        '["php", "html", "js"]',
      );
      expect(arr).toEqual([3, 4, 2]);
    });

    it("can`t return the same tech twice", async () => {
      const arr = await techService.createOrGetMultipleTechs(
        '["php", "html", "js", "js"]',
      );
      expect(arr).toEqual([3, 4, 2]);
    });

    it("throws an error if string given is not a valid json", async () => {
      expect(
        techService.createOrGetMultipleTechs("manipulated string"),
      ).rejects.toThrow("Please provide techs in an allowed format");
    });

    it("throws an error if techs provided are not strings", async () => {
      expect(
        techService.createOrGetMultipleTechs('["Jest", {}, "Docker", 12]'),
      ).rejects.toThrow("Techs should be on string format");
    });

    it("throws an error if string given is a JSON object", async () => {
      expect(
        techService.createOrGetMultipleTechs('{"id": 1, "name": "rick"}'),
      ).rejects.toThrow("Please provide techs in an allowed format");
    });
  });
});
