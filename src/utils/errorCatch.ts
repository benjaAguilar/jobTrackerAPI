import { Request, Response, Next, RequestHandler } from "../types/express";

export const tryCatch =
  (controller: RequestHandler) =>
  async (req: Request, res: Response, next: Next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
