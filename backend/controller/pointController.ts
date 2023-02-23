import type { Request, Response } from "express";
import { logger } from "../utils/logger";
import { PointsService } from "../service/pointsService";

export class PointsController {
	constructor(private pointsService: PointsService) {}

    getPoint = async (req: Request, res: Response) => {
		try {
			const { customer_id } = req.body;
			const pointResult = await this.pointsService.getPoint(customer_id);

			if (pointResult.length > 0) {
				res.json({ message: "found promo", data: pointResult });
				return;
			} else {
				res.status(400).json({ message: "no such promo" });
			}
		} catch (error) {
			logger.error(error.message);
			res.status(500).json({ message: "internal server error" });
			
		}
	}
    addPoint = async (req: Request, res: Response) => {
		const point_type = "Earn"
		const { amount, uuid } = req.body;
		const point = await this.pointsService.addPoint(
            amount, point_type,  uuid
		);

		if (point) {
			res.json({ message: "create point success" });
		} else {
			res.status(400).json({ message: "create point failed" });
		}
	}

	redeemByPoint = async (req: Request, res: Response) => {
		const { amount, point_type, transaction_date, customer_id } = req.body;
		const redeem = await this.pointsService.redeemByPoint(
            amount, point_type, transaction_date, customer_id
		);

		if (redeem) {
			res.json({ message: "redeem by point success" });
		} else {
			res.status(400).json({ message: "redeem by point failed" });
		}
	}

	showTotalPoint = async (req: Request, res: Response) => {
		try {
			const { uuid } = req.body;
			const pointResult = await this.pointsService.showTotalPoint(uuid);
			const result = {
				uuid: uuid,
				amount: pointResult
			}

			if (pointResult.length > 0) {
				res.json({ message: "show total points", data: result });
				return
			} else {
				res.status(400).json({ message: "no such point record" });
			}
		} catch (error) {
			logger.error(error.message);
			res.status(500).json({ message: "internal server error" });
			
		}
	}

}