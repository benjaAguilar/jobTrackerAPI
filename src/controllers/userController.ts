import { getValidationRes } from "../middlewares/validationResult";
import { Request, Response, Next } from "../types/express";
import { CustomError } from "../utils/customError";
import { tryCatch } from "../utils/errorCatch";
import { validateRegister } from "../utils/validator";
import bcrypt from "bcryptjs";

export const registerUser = [
  ...validateRegister,
  tryCatch((req: Request, res: Response, next: Next) => {
    getValidationRes(req);

    const { username, email, password } = req.body;

    // hashear la constrasena
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err || !hashedPassword) {
        return next(
          new CustomError("Internal error registering the user", 500),
        );
      }

      // create user on db

      res.json({
        success: true,
        message: `User ${username} created ${email}`,
      });
    });
  }),
];
