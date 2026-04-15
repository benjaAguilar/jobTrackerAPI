import express from "express";
import dotenv from "dotenv";
import router from "./routes";
import { errorHandler } from "./controllers/errorHandler";
import { createServices } from "./services";

export const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const services = createServices();
app.locals.services = services;

app.use(router);

app.use(errorHandler);
