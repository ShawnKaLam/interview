import express from "express";
import { pointsController } from "../routes";
// import { isLoggedInAPI } from "../utils/guard";
import { asyncWrapper } from "../utils/wrapper";

export const pointsRoutes = express.Router();
pointsRoutes.get("/get", asyncWrapper(pointsController.getPoint));
pointsRoutes.post("/create", asyncWrapper(pointsController.addPoint));
pointsRoutes.post("/pointredeem", asyncWrapper(pointsController.redeemByPoint));
pointsRoutes.post("/totalpoints", asyncWrapper(pointsController.showTotalPoint));