import { validationResult } from "express-validator";
import { CustomValidationError } from "../utils/customError";
import { Request } from "../types/express.js";

export function getValidationRes(req: Request) {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    throw new CustomValidationError(
      "validation error",
      400,
      validationErrors.array(),
    );
  }
}
