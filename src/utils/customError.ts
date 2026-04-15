import type { ValidationError } from "express-validator";

export class CustomError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export class CustomValidationError extends Error {
  public statusCode: number;
  public validationArray: ValidationError[];

  constructor(
    message: string,
    statusCode: number,
    validationArray: ValidationError[],
  ) {
    super(message);
    this.statusCode = statusCode;
    this.validationArray = validationArray;

    Object.setPrototypeOf(this, CustomValidationError.prototype);
  }
}
