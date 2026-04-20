import bcrypt from "bcryptjs";
import { CustomError } from "./customError";

export async function comparePasswords(
  inputPassword: string,
  hashedPassword: string,
) {
  const match = await bcrypt.compare(inputPassword, hashedPassword);

  if (!match) throw new CustomError("Incorrect Password", 400);
}
