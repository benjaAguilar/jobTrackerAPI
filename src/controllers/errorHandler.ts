import { Error, Request, Response, Next } from "../types/express";
import { CustomError, CustomValidationError } from "../utils/customError";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: Next,
) {
  console.log(err);

  if (err instanceof CustomValidationError) {
    console.log(err.message);

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      fields: err.validationArray,
    });
  }

  if (err instanceof CustomError) {
    console.log(err.message);

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server Error",
  });
}
