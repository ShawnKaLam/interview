import type { Request, Response } from "express";
import { logger } from "../utils/logger";
import { StoresService } from "../service/storesService";
import { checkPassword } from "../utils/hash";
import jwtSimple from "jwt-simple";
import jwt from "../utils/jwt";

export class StoresController {
	constructor(private storesService: StoresService) {}

	getStore = async (req: Request, res: Response) => {
		try {
			const { username } = req.body;
			const userResult = await this.storesService.getStore(username);

			if (userResult.length > 0) {
				res.json({ message: "found store user", data: userResult });
				return;
			} else {
				res.status(400).json({ message: "no such user" });
			}
		} catch (error) {
			logger.error(error.message);
			res.status(500).json({ message: "internal server error" });
		}
	};

	register = async (req: Request, res: Response) => {
		const { name, username, password, location, size, company_id } = req.body;
		const store = await this.storesService.createStore(
			name,
			username,
			password,
			location,
			size,
			company_id
		);

		if (store.length > 0) {
			res.json({ message: "signup success" });
		} else {
			res.status(400).json({ message: "signup failed" });
		}
	};

	login = async (req: Request, res: Response) => {
		try {
			const { username, password } = req.body;
			if (!username || !password) {
				res.status(400).json({ message: "missing username / password" });
				return;
			}

			const store = await this.storesService.checkStore(username);
			if (!store) {
				res.status(400).json({ message: "no such user" });
				return;
			} else {
				let result = await checkPassword(password, store.password);
				if (!result) {
					res.status(400).json({ message: "wrong password" });
					return;
				}

				// start generating jwt
				const payload = { id: store.id, username: store.username };
				const shopToken = jwtSimple.encode(payload, jwt.jwtSecret);
				res.json({ message: "login success", data: shopToken });
			}
		} catch (error) {
			logger.error(error.message);
			res.status(500).json({ message: "internal server error" });
			// throw new InternalServerError();
		}
	};
}
