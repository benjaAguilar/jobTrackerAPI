import { Strategy as jwtStrategy, VerifiedCallback } from "passport-jwt";
import passport from "passport";
import { CustomServerError } from "../utils/customError";
import { Request } from "../types/express";
import type { Algorithm } from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";

export type JwtPayload = {
  sub: number;
  iat: number;
  exp: number;
};

type Passport = passport.PassportStatic;

const secret = process.env.SECRET_JWT;

if (!secret) {
  throw new CustomServerError("env variable SECRET_JWT is not set", 500);
}

function getAuthCookie(req: Request) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["authToken"];
  }
  return token;
}

const jwtOptions = {
  jwtFromRequest: getAuthCookie,
  secretOrKey: secret,
  algorithms: ["HS256"] as Algorithm[],
  jsonWebTokenOptions: {
    maxAge: "1d",
  },
};

export default function configurePassport(
  passport: Passport,
  userService: UserRepository,
) {
  passport.use(
    new jwtStrategy(
      jwtOptions,
      (payload: JwtPayload, done: VerifiedCallback) => {
        const currentTime = Math.floor(Date.now() / 1000);
        if (!payload.exp || payload.exp < currentTime) {
          return done(null, false, { message: "Token expired" });
        }

        userService
          .getById(payload.sub)
          .then((user) => {
            return done(null, user);
          })
          .catch((err) => done(err, false));
      },
    ),
  );
}
