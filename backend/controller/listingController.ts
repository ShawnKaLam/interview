import type { Request, Response } from "express";
import { logger } from "../utils/logger";
import { ListingsService } from "../service/listingsService";

export class ListingsController {
	constructor(private listingsService: ListingsService) {}

    getListing = async (req: Request, res: Response) => {
        const listingResult = await this.listingsService.getListing()
        res.json(listingResult)
    }
	getListingById= async (req: Request, res: Response) => {
		try {
			const { company_id } = req.body;
			const listingResult = await this.listingsService.getListingByID(company_id);

			if (listingResult.length > 0) {
				res.json({ message: "found ad", data: listingResult });
				return;
			} else {
				res.status(400).json({ message: "no such listing" });
			}
		} catch (error) {
			logger.error(error.message);
			res.status(500).json({ message: "internal server error" });
			
		}
	}
    createListing = async (req: Request, res: Response) => {
		const { name, description , coupon_type, points_required, valid_start, valid_end, company_id} = req.body;
		const listing = await this.listingsService.createListing(
            name, description , coupon_type, points_required, valid_start, valid_end, company_id
		);

		if (listing.length > 0) {
			res.json({ message: "create success" });
		} else {
			res.status(400).json({ message: "create failed" });
		}
	};

    deleteListing = async (req: Request, res: Response) => {
        const { id } = req.body;
        const listing = await this.listingsService.deleteListing(id)

        if (listing.length > 0) {
			res.json({ message: "delete success" });
		} else {
			res.status(400).json({ message: "delete failed" });
		}
    }}