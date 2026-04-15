import express from "express";
import dotenv from "dotenv";
import router from "./routes";
import { errorHandler } from "./controllers/errorHandler";

export const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use(errorHandler);
