import { Router } from "express";
import userRouter from "./user.routes";
import authRouter from "./auth.routes";
import jobRouter from "./job.routes";
const router = Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/job", jobRouter);

export default router;
