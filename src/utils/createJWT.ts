import jsonwebtoken from "jsonwebtoken";
import { CustomServerError } from "./customError";

const EXPIRES_IN = "1d";

export default function createJWT(userId: number) {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
  };

  const secret = process.env.SECRET_JWT;

  if (!secret) {
    throw new CustomServerError("env var SECRET_JWT is not set", 500);
  }

  const signedToken = jsonwebtoken.sign(payload, secret, {
    expiresIn: EXPIRES_IN,
    algorithm: "HS256",
  });

  return signedToken;
}
