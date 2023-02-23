import express from "express";
import { companiesController } from "../routes";
// import { isLoggedInAPI } from "../utils/guard";
import { asyncWrapper } from "../utils/wrapper";

export const companiesRoutes = express.Router();
companiesRoutes.post("/register", asyncWrapper(companiesController.register));
companiesRoutes.get("/getCompany", asyncWrapper(companiesController.getCompany));
companiesRoutes.get("/showCompany", asyncWrapper(companiesController.showCompany));
companiesRoutes.post("/login", asyncWrapper(companiesController.login));
companiesRoutes.post("/update", asyncWrapper(companiesController.update));
