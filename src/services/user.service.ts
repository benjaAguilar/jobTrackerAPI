import { User } from "../../generated/prisma/client";
import { UserRepository } from "../repositories/user.repository";

export class UserService implements UserRepository {
  private userRepo: UserRepository;

  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  async create(data: {
    username: string;
    password: string;
    email: string;
  }): Promise<User> {
    return this.userRepo.create(data);
  }
}
