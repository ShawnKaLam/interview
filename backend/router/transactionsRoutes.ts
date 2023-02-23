import express from "express";
import { transactionsController } from "../routes";
import { isStoreLoggedIn } from "../utils/guard";
import { asyncWrapper } from "../utils/wrapper";

export const transactionsRoutes = express.Router();
transactionsRoutes.post("/get", asyncWrapper(transactionsController.getTransaction));
transactionsRoutes.post("/create", isStoreLoggedIn, asyncWrapper(transactionsController.createTransaction));

