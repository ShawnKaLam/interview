import type { Request, Response } from "express";
import { logger } from "../utils/logger";
import { TransactionsService } from "../service/transactionsService";
import { PointsService } from "../service/pointsService";

export class TransactionsController {
	constructor(private transactionsService: TransactionsService, private pointService: PointsService) {}

	getTransaction = async (req: Request, res: Response) => {
		try {
			const { uuid } = req.body;
			const transactionResult = await this.transactionsService.getTransaction(
				uuid
			);

			if (transactionResult.length > 0) {
				res.json({ message: "found transaction", data: transactionResult });
				return;
			} else if (transactionResult.length = 0) {
				res.json({ message: "no transaction" });
			}
		} catch (error) {
			logger.error(error.message);
			res.status(500).json({ message: "internal server error" });
		}
	};

	createTransaction = async (req: Request, res: Response) => {
		console.log("createTransaction");
		const store_user_id = +req["user"]["id"];
		const { amount, payment_method, collect_point, is_refund, uuid } = req.body;

		await this.transactionsService.createTransaction(
			amount,
			payment_method,
			collect_point,
			is_refund,
			store_user_id,
			uuid
		);
		await this.pointService.addPoint(amount, "Earn", uuid);
		res.json({ message: "create transaction success" });
	};
}
