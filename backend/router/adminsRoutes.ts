import express from "express";
import { adminsController } from "../routes";
// import { isLoggedInAPI } from "../utils/guard";
import { asyncWrapper } from "../utils/wrapper";

export const adminsRoutes = express.Router();
adminsRoutes.get("/getAdmin", asyncWrapper(adminsController.getAdmin));
adminsRoutes.post("/login", asyncWrapper(adminsController.login));
