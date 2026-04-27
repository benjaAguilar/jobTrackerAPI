import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller";
import { jwtAuthStrategy } from "../middlewares/passport";
const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/logout", jwtAuthStrategy, logout);

export default authRouter;
