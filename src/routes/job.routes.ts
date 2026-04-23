import { Router } from "express";
import { jwtAuthStrategy } from "../middlewares/passport";
import { create, getJobs } from "../controllers/job.controller";
const jobRouter = Router();

jobRouter.post("/create", jwtAuthStrategy, create);
jobRouter.get("/", jwtAuthStrategy, getJobs);

export default jobRouter;
