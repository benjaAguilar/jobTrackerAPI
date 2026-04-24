import { Router } from "express";
import { jwtAuthStrategy } from "../middlewares/passport";
import { create, getJobs, update } from "../controllers/job.controller";
const jobRouter = Router();

jobRouter.post("/create", jwtAuthStrategy, create);
jobRouter.get("/", jwtAuthStrategy, getJobs);
jobRouter.put("/:jobId", jwtAuthStrategy, update);

export default jobRouter;
