import type { Request, Response } from "express";
import { logger } from "../utils/logger";
import { AdminsService } from "../service/adminsService"
import { checkPassword } from "../utils/hash";
import jwtSimple from "jwt-simple";
import jwt from "../utils/jwt";

export class AdminsController {
	constructor(private adminsService: AdminsService) {}

	getAdmin = async (req: Request, res: Response) => {
		try {
			const { name } = req.body;
			const userResult = await this.adminsService.getAdmin(name);

			if (userResult.length > 0) {
				res.json({ message: "found admin", data: userResult });
				return;
			} else {
				res.status(400).json({ message: "no such user" });
			}
		} catch (error) {
			logger.error(error.message);
			res.status(500).json({ message: "internal server error" });
			
		}
	};
    login = async (req: Request, res: Response) => {
		try {
			const { username, password } = req.body;
			if (!username || !password) {
				res.status(400).json({ message: "missing username / password" });
				return;
			}

			const admin = await this.adminsService.checkAdmin(
				username
				// password,
			);

			if (!admin) {
				res.status(400).json({ message: "no such user" });
				return;
			} else {
				let result = await checkPassword(password, admin.password);
				if (!result) {
					res.status(400).json({ message: "wrong password" });
					return;
				}

				// start generating jwt
				const payload = {
					id: admin.id,
					username: admin.username
				};
				const token = jwtSimple.encode(payload, jwt.jwtSecret);

				res.json({ message: "login success", data: token });
			}
		} catch (error) {
			logger.error(error.message);
			res.status(500).json({ message: "internal server error" });
			// throw new InternalServerError();
		}
	};
}
