import { Tech } from "../../generated/prisma/client";
import { TechRepository } from "../repositories/tech.repository";
import { normalizeTechs } from "../utils/normalizeTech";

export class TechService implements TechRepository {
  private techRepo: TechRepository;

  constructor(techRepo: TechRepository) {
    this.techRepo = techRepo;
  }

  async createMultipleTechs(techs: string): Promise<number[]> {
    return await Promise.all(
      JSON.parse(techs).map(async (tech: string) => {
        const normalizedTech = normalizeTechs(tech);
        const tec = await this.techRepo.createOrGet(normalizedTech);
        return tec.id;
      }),
    );
  }

  async createOrGet(techName: string): Promise<Tech> {
    return this.techRepo.createOrGet(techName);
  }
}
