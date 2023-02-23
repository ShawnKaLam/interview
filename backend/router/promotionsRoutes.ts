import express from "express";
import { promotionsController } from "../routes";
// import { isLoggedInAPI } from "../utils/guard";
import { asyncWrapper } from "../utils/wrapper";

export const promotionsRoutes = express.Router();
promotionsRoutes.get("/getAd", asyncWrapper(promotionsController.getPromotion));
promotionsRoutes.get("/getAdById", asyncWrapper(promotionsController.getPromotionByID));
promotionsRoutes.post("/create", asyncWrapper(promotionsController.createPromotion));
promotionsRoutes.post("/delete", asyncWrapper(promotionsController.deletePromotion));
