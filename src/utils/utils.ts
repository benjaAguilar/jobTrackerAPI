import { CustomError } from "./customError";

export function parseJson(str: string): object | null {
  try {
    const json = JSON.parse(str);
    return json;
  } catch (e) {
    return null;
  }
}

export function parseParamId(param: string | string[]): number {
  if (Array.isArray(param) || isNaN(parseInt(param)))
    throw new CustomError("Provide a valid parameter id", 400);

  return parseInt(param);
}
