import { Tech } from "../../generated/prisma/client";
import { TechRepository } from "../repositories/tech.repository";
import { CustomError } from "../utils/customError";
import { normalizeTechs } from "../utils/normalizeTech";
import { parseJson } from "../utils/utils";

export class TechService implements TechRepository {
  private techRepo: TechRepository;

  constructor(techRepo: TechRepository) {
    this.techRepo = techRepo;
  }

  async createOrGetMultipleTechs(techs: string): Promise<number[]> {
    const parsedTechs = parseJson(techs);

    if (!parsedTechs || !Array.isArray(parsedTechs)) {
      throw new CustomError("Please provide techs in an allowed format", 400);
    }

    const [hasOtherType] = parsedTechs.filter(
      (val: any) => typeof val !== "string",
    );
    if (hasOtherType) {
      throw new CustomError("Techs should be on string format", 400);
    }

    const arrOfTechs = await Promise.all(
      parsedTechs.map(async (tech: string) => {
        const normalizedTech = normalizeTechs(tech);
        const tec = await this.techRepo.createOrGet(normalizedTech);
        return tec.id;
      }),
    );
    return [...new Set(arrOfTechs)];
  }

  async createOrGet(techName: string): Promise<Tech> {
    return this.techRepo.createOrGet(techName);
  }
}
