import type { Request, Response } from "express";
import { logger } from "../utils/logger";
import { CouponsService } from "../service/couponsService";

export class CouponsController {
	constructor(private couponsService: CouponsService) {}

    getCoupon = async (req: Request, res: Response) => {
		try {
			const { customer_id } = req.body;
			const couponResult = await this.couponsService.getCoupon(customer_id);

			if (couponResult.length > 0) {
				res.json({ message: "found coupon", data: couponResult });
				return;
			} else {
				res.status(400).json({ message: "no such coupon" });
			}
		} catch (error) {
			logger.error(error.message);
			res.status(500).json({ message: "internal server error" });
			
		}
	}
    createCoupon = async (req: Request, res: Response) => {
		const { transaction_date, name, description, expiry, is_used, is_expired, customer_id } = req.body;
		const coupon = await this.couponsService.createCoupon(
            transaction_date, name, description, expiry, is_used, is_expired, customer_id
		);

		if (coupon.length > 0) {
			res.json({ message: "create coupon success" });
		} else {
			res.status(400).json({ message: "create coupon failed" });
		}
	}
}