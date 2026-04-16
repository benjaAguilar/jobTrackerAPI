import { getValidationRes } from "../middlewares/validationResult";
import { Services } from "../services";
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

    // hash password
    //TODO: decople bcrypt from the controller
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err || !hashedPassword) {
        return next(
          new CustomError("Internal error registering the user", 500),
        );
      }

      // create user on db
      const { userService } = req.app.locals.services as Services;
      await userService.create({
        username: username,
        password: hashedPassword,
        email: email,
      });

      res.json({
        success: true,
        message: `User ${username} registered`,
      });
    });
  }),
];

//TODO: Work on login and cookies with JWT
