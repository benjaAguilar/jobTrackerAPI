import { Router } from "express";
import { jwtAuthStrategy } from "../middlewares/passport";
import {
  create,
  deleteJob,
  getJobs,
  update,
} from "../controllers/job.controller";
const jobRouter = Router();

jobRouter.post("/create", jwtAuthStrategy, create);
jobRouter.get("/", jwtAuthStrategy, getJobs);
jobRouter.put("/:jobId", jwtAuthStrategy, update);
jobRouter.delete("/:jobId", jwtAuthStrategy, deleteJob);

export default jobRouter;
