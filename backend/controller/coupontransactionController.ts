import type { Request, Response } from "express";
import { logger } from "../utils/logger";
import { CoupontransactionsService } from "../service/coupontransactionsService";

export class CoupontransactionsController {
	constructor(private coupontransactionsService: CoupontransactionsService) {}

    getCoupontransaction = async (req: Request, res: Response) => {
		try {
			const { customer_id } = req.body;
			const coupontransactionResult = await this.coupontransactionsService.getCoupontransaction(customer_id);

			if (coupontransactionResult.length > 0) {
				res.json({ message: "found coupon transaction", data: coupontransactionResult });
				return;
			} else {
				res.status(400).json({ message: "no such coupon transaction" });
			}
		} catch (error) {
			logger.error(error.message);
			res.status(500).json({ message: "internal server error" });
			
		}
	}
    createCoupontransaction = async (req: Request, res: Response) => {
		const { total, quantity, transaction_date, listing_id, customer_id } = req.body;
		const coupontransaction = await this.coupontransactionsService.createCoupontransaction(
            total, quantity, transaction_date, listing_id, customer_id
		);

		if (coupontransaction.length > 0) {
			res.json({ message: "create coupon transaction success" });
		} else {
			res.status(400).json({ message: "create coupon transaction failed" });
		}
	}
}