import type { Request, Response } from "express";
import { logger } from "../utils/logger";
import { PromotionsService } from "../service/promotionsService";

export class PromotionsController {
	constructor(private promotionsService: PromotionsService) {}

    getPromotion = async (req: Request, res: Response) => {
        const promotionResult = await this.promotionsService.getPromotion()
        res.json(promotionResult)
    }
	getPromotionByID= async (req: Request, res: Response) => {
		try {
			const { listing_id } = req.body;
			const promotionResult = await this.promotionsService.getPromotionByID(listing_id);

			if (promotionResult.length > 0) {
				res.json({ message: "found promo", data: promotionResult });
				return;
			} else {
				res.status(400).json({ message: "no such promo" });
			}
		} catch (error) {
			logger.error(error.message);
			res.status(500).json({ message: "internal server error" });
			
		}
	}
    createPromotion = async (req: Request, res: Response) => {
		const { name, description , discount, promotion_type, start_date, end_date, listing_id } = req.body;
		const promo = await this.promotionsService.createPromotion(
            name, description , discount, promotion_type, start_date, end_date, listing_id
		);

		if (promo.length > 0) {
			res.json({ message: "create success" });
		} else {
			res.status(400).json({ message: "create failed" });
		}
	};

    deletePromotion = async (req: Request, res: Response) => {
        const { id } = req.body;
        const promo = await this.promotionsService.deletePromotion(id)

        if (promo.length > 0) {
			res.json({ message: "delete success" });
		} else {
			res.status(400).json({ message: "delete failed" });
		}
    }}