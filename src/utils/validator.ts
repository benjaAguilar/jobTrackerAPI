import { body } from "express-validator";

export const validateRegister = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 4, max: 30 })
    .withMessage(
      "Username has to be at least 4 characters and a maximum of 30 characters",
    )
    .isAlphanumeric()
    .withMessage("Username can only contain aplhanumeric caracters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Use a valid email"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 30 })
    .withMessage(
      "Password has to be at least 8 characters and a maximum of 30 characters",
    ),
  body("r_password")
    .trim()
    .notEmpty()
    .withMessage("Repeat password is required")
    .custom((value: string, { req }) => {
      if (!req.body) {
        return true;
      }

      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];
