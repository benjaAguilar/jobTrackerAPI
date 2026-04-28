import e from "express";
import { body, query } from "express-validator";

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

export const validateLogin = [
  body("usernameOrEmail")
    .trim()
    .notEmpty()
    .withMessage("Username or Email is required"),
  body("password").trim().notEmpty().withMessage("Password is required"),
];

export const validateCreateJob = [
  body("vacantName").trim().notEmpty().withMessage("Vacant Name is required"),
  body("company").trim().notEmpty().withMessage("Company Name is required"),
  body("notes").trim(),
  body("state")
    .trim()
    .notEmpty()
    .withMessage("Job state is required")
    .custom((val: string) => {
      const enums = ["offer", "applied", "interview", "rejected"];
      const [isValidEnum] = enums.filter((enu) => val === enu);

      if (!isValidEnum) return false;

      return true;
    })
    .withMessage("Please provide a valid job state"),
];

export const validateGetJobEvent = [
  query("state")
    .trim()
    .notEmpty()
    .withMessage("Job state is required")
    .custom((val: string) => {
      const enums = ["offer", "applied", "interview", "rejected"];
      const [isValidEnum] = enums.filter((enu) => val === enu);

      if (!isValidEnum) return false;

      return true;
    })
    .withMessage("Please provide a valid job state"),
  query("containState")
    .trim()
    .notEmpty()
    .withMessage("Job state is required")
    .custom((val: string) => {
      const enums = ["offer", "applied", "interview", "rejected"];
      const [isValidEnum] = enums.filter((enu) => val === enu);

      if (!isValidEnum) return false;

      return true;
    })
    .withMessage("Please provide a valid job state"),
  query("noneState")
    .trim()
    .custom((val: string | undefined) => {
      if (!val) return true;

      const enums = ["offer", "applied", "interview", "rejected"];
      const [isValidEnum] = enums.filter((enu) => val === enu);

      if (!isValidEnum) return false;

      return true;
    })
    .withMessage("Please provide a valid job state"),
  query("from")
    .trim()
    .notEmpty()
    .custom((val: string) => {
      const date = new Date(val);
      if (date.toUTCString() === "Invalid Date") return false;
      return true;
    })
    .withMessage("Please provide a valid date"),
  query("to")
    .trim()
    .notEmpty()
    .custom((val: string) => {
      const date = new Date(val);
      if (date.toUTCString() === "Invalid Date") return false;
      return true;
    })
    .withMessage("Please provide a valid date"),
];
