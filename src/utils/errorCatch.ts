import { Request, Response, Next } from "../types/express";

type AsyncHandler<TReq extends Request> = (
  req: TReq,
  res: Response,
  next: Next,
) => Promise<any>;

export const tryCatch =
  <TReq extends Request>(controller: AsyncHandler<TReq>) =>
  async (req: TReq, res: Response, next: Next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
