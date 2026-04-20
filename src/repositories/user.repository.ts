import { User } from "../../generated/prisma/client";

export interface UserRepository {
  create(data: {
    username: string;
    password: string;
    email: string;
  }): Promise<User>;

  get(usernameOrEmail: string): Promise<User>;
}
