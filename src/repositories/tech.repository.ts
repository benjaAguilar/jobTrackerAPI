import { Tech } from "../../generated/prisma/client";

export interface TechRepository {
  createOrGet(techName: string): Promise<Tech>;
}
