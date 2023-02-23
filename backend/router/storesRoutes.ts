import express from "express";
import { storesController } from "../routes";
import { asyncWrapper } from "../utils/wrapper";

export const storesRoutes = express.Router();
storesRoutes.post("/register", asyncWrapper(storesController.register));
storesRoutes.get("/getStore", asyncWrapper(storesController.getStore));
storesRoutes.post("/login", asyncWrapper(storesController.login));
