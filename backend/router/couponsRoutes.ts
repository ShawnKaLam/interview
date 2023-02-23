import express from "express";
import { couponsController } from "../routes";
// import { isLoggedInAPI } from "../utils/guard";
import { asyncWrapper } from "../utils/wrapper";

export const couponsRoutes = express.Router();
couponsRoutes.get("/get", asyncWrapper(couponsController.getCoupon));
couponsRoutes.post("/create", asyncWrapper(couponsController.createCoupon));
