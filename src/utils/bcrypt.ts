import bcrypt from "bcryptjs";
import { CustomError, CustomServerError } from "./customError";

export async function comparePasswords(
  inputPassword: string,
  hashedPassword: string,
) {
  const match = await bcrypt.compare(inputPassword, hashedPassword);

  if (!match) throw new CustomError("Incorrect Password", 400);
}

export async function hashPassword(password: string): Promise<string> {
  const hash = await bcrypt.hash(password, 10);
  return hash;
}
