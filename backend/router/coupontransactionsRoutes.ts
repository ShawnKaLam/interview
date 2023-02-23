import express from "express";
import { coupontransactionsController } from "../routes";
import { isStoreLoggedIn } from "../utils/guard";
import { asyncWrapper } from "../utils/wrapper";

export const coupontransactionsRoutes = express.Router();
coupontransactionsRoutes.get("/get", asyncWrapper(coupontransactionsController.getCoupontransaction));
coupontransactionsRoutes.post("/create", isStoreLoggedIn,asyncWrapper(coupontransactionsController.createCoupontransaction));

