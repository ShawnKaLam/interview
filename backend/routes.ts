import { knex } from "./main";
import express from "express";

import { CustomersService } from "./service/customersService";
import { CustomersController } from "./controller/customerController";
import { CompaniesService } from "./service/companiesService";
import { CompaniesController } from "./controller/companyController";
import { StoresService } from "./service/storesService";
import { StoresController } from "./controller/storeController";
import { AdminsService } from "./service/adminsService";
import { AdminsController } from "./controller/adminController";
// import { AdvertisementsService } from "./service/advertisementsService";
// import { AdvertisementsController } from "./controller/advertisementController";
import { PromotionsService } from "./service/promotionsService";
import { PromotionsController } from "./controller/promotionController";
import { ListingsService } from "./service/listingsService";
import { ListingsController } from "./controller/listingController";
import { PointsService } from "./service/pointsService";
import { PointsController } from "./controller/pointController";

import { TransactionsService } from "./service/transactionsService";
import { TransactionsController } from "./controller/transactionController";
import { CoupontransactionsService } from "./service/coupontransactionsService";
import { CoupontransactionsController } from "./controller/coupontransactionController";
import { CouponsService } from "./service/couponsService";
import { CouponsController } from "./controller/couponController";

export const customersService = new CustomersService(knex);
export const customersController = new CustomersController(customersService);
export const companiesService = new CompaniesService(knex);
export const companiesController = new CompaniesController(companiesService);
export const storesService = new StoresService(knex);
export const storesController = new StoresController(storesService);
export const adminsService = new AdminsService(knex);
export const adminsController = new AdminsController(adminsService);
// export const advertisementsService = new AdvertisementsService(knex);
// export const advertisementsController = new AdvertisementsController(advertisementsService);
export const promotionsService = new PromotionsService(knex);
export const promotionsController = new PromotionsController(promotionsService);
export const listingsService = new ListingsService(knex);
export const listingsController = new ListingsController(listingsService);
export const pointsService = new PointsService(knex);
export const pointsController = new PointsController(pointsService);

export const transactionsService = new TransactionsService(knex);
export const transactionsController = new TransactionsController(transactionsService, pointsService);
export const coupontransactionsService = new CoupontransactionsService(knex);
export const coupontransactionsController = new CoupontransactionsController(coupontransactionsService);
export const couponsService = new CouponsService(knex);
export const couponsController = new CouponsController(couponsService);

import { customersRoutes } from "./router/customersRoutes";
import { companiesRoutes } from "./router/companiesRoutes";
import { storesRoutes } from "./router/storesRoutes";
import { adminsRoutes } from "./router/adminsRoutes";
// import { advertisementsRoutes } from "./router/advertisementsRoutes";
import { promotionsRoutes } from "./router/promotionsRoutes";
import { listingsRoutes } from "./router/listingsRoutes";
import { pointsRoutes } from "./router/pointsRoutes";
import { transactionsRoutes } from "./router/transactionsRoutes";
import { coupontransactionsRoutes } from "./router/coupontransactionsRoutes";
import { couponsRoutes } from "./router/couponsRoutes";


export const routes = express.Router();

routes.use("/customers", customersRoutes);
routes.use("/companies", companiesRoutes);
routes.use("/stores", storesRoutes);
routes.use("/admins", adminsRoutes);
// routes.use("/advertisements", advertisementsRoutes);
routes.use("/promotions", promotionsRoutes);
routes.use("/listings", listingsRoutes);
routes.use("/points", pointsRoutes);
routes.use("/transactions", transactionsRoutes);
routes.use("/coupon_transactions", coupontransactionsRoutes);
routes.use("/coupons", couponsRoutes);
