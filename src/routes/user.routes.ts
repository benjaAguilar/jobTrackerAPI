import { Router } from "express";
import { registerUser } from "../controllers/user.controller";
const userRouter = Router();

userRouter.post("/create", registerUser);

export default userRouter;
