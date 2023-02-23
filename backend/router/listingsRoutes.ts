import express from "express";
import { listingsController } from "../routes";
// import { isLoggedInAPI } from "../utils/guard";
import { asyncWrapper } from "../utils/wrapper";

export const listingsRoutes = express.Router();
listingsRoutes.get("/getListing", asyncWrapper(listingsController.getListing));
listingsRoutes.get("/getListingById", asyncWrapper(listingsController.getListingById));
listingsRoutes.post("/create", asyncWrapper(listingsController.createListing));
listingsRoutes.post("/delete", asyncWrapper(listingsController.deleteListing));
