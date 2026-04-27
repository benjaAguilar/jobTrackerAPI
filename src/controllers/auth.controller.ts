import { getValidationRes } from "../middlewares/validationResult";
import { Services } from "../services";
import { Request, Response } from "../types/express";
import { comparePasswords, hashPassword } from "../utils/bcrypt";
import createJWT from "../utils/createJWT";
import { tryCatch } from "../utils/errorCatch";
import { validateLogin, validateRegister } from "../utils/validator";

export const register = [
  ...validateRegister,
  tryCatch(async (req: Request, res: Response) => {
    getValidationRes(req);

    const { username, email, password } = req.body;

    const hashedPassword = await hashPassword(password);

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
  }),
];

export const login = [
  ...validateLogin,
  tryCatch(async (req: Request, res: Response) => {
    getValidationRes(req);

    const { usernameOrEmail, password } = req.body;

    const { userService } = req.app.locals.services as Services;
    const user = await userService.get(usernameOrEmail);

    await comparePasswords(password, user.password);

    const token = createJWT(user.id);

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: `Logged in as ${user.username}`,
    });
  }),
];

export const logout = tryCatch(async (_req: Request, res: Response) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });

  res.json({
    success: true,
    message: "Logged out",
  });
});
