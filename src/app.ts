import express from "express";
import dotenv from "dotenv";
import router from "./routes";
import cookieParser from "cookie-parser";
import { errorHandler } from "./controllers/errorHandler";
import { createServices } from "./services";
import configurePassport from "./lib/passport";
import passport from "passport";

export const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const services = createServices();
app.locals.services = services;

configurePassport(passport, services.userService);
app.use(passport.initialize());

app.use("/api", router);

app.use(errorHandler);
