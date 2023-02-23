import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { logger } from "./utils/logger";
import Knex from "knex";
import config from "./knexfile";
import cors from "cors";

export const knex = Knex(config[process.env.NODE_ENV ?? "development"]);

const app = express();
app.use(cors({credentials: true}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, _res, next) => {
	logger.info(`Path: ${req.path},,, Method: ${req.method}`);
	next();
});

import { routes } from "./routes";
import { ApplicationError } from "./utils/error";
app.use(routes);

app.use((_req, res) => {
	res.sendFile(path.resolve("./public/404.html"));
});

app.use(
	(err: ApplicationError, _req: express.Request, res: express.Response) => {
		logger.error(err.message);
		res.status(err.httpStatus).json({ message: err.message });
	}
);

const port = 8080;
app.listen(port, () => {
	logger.info(`App listening on http://localhost:${port}`);
});
