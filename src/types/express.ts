import express from "express";
import { User } from "../../generated/prisma/client";

export type Request = express.Request;
export type Response = express.Response;
export type Next = express.NextFunction;
export type RequestHandler = express.RequestHandler;
export type Error = express.ErrorRequestHandler;
export interface AuthenticatedRequest extends Request {
  user: User;
}
