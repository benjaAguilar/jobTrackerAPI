import { Router } from "express";
import { registerUser } from "../controllers/userController";
const userRouter = Router();

userRouter.post("/create", registerUser);

export default userRouter;
