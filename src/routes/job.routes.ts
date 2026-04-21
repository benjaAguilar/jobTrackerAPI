import { Router } from "express";
import { jwtAuthStrategy } from "../middlewares/passport";
import { create } from "../controllers/job.controller";
const jobRouter = Router();

jobRouter.post("/create", jwtAuthStrategy, create);

export default jobRouter;
