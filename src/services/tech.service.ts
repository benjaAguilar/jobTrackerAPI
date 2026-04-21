import { Tech } from "../../generated/prisma/client";
import { TechRepository } from "../repositories/tech.repository";
import { normalizeTechs } from "../utils/normalizeTech";

export class TechService implements TechRepository {
  private techRepo: TechRepository;

  constructor(techRepo: TechRepository) {
    this.techRepo = techRepo;
  }

  async createOrGet(techName: string): Promise<Tech> {
    const tech = normalizeTechs(techName);
    return this.techRepo.createOrGet(tech);
  }
}
