import type { Request, Response } from "express";
import { logger } from "../utils/logger";
import { CompaniesService } from "../service/companiesService";
import { checkPassword } from "../utils/hash";
import jwtSimple from "jwt-simple";
import jwt from "../utils/jwt";

export class CompaniesController {
	constructor(private companiesService: CompaniesService) {}
	showCompany = async(req:Request, res:Response) => {
		const companyResult = await this.companiesService.showCompany()
		res.json(companyResult)

	}
	getCompany = async (req: Request, res: Response) => {
		try {
			const { username } = req.body;
			const userResult = await this.companiesService.getCompany(username);

			if (userResult.length > 0) {
				res.json({ message: "found company", data: userResult });
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
		const { name, username, password, number_of_store, target_customer, company_type, found_date, size } = req.body;
		const company = await this.companiesService.createCompany(
            name, username, password, number_of_store, target_customer, company_type, found_date, size
		);

		if (company.length > 0) {
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

			const company = await this.companiesService.checkCompany(
				username
				// password,
			);

			if (!company) {
				res.status(400).json({ message: "no such user" });
				return;
			} else {
				let result = await checkPassword(password, company.password);
				if (!result) {
					res.status(400).json({ message: "wrong password" });
					return;
				}

				// start generating jwt
				const payload = {
					uuid: company.id,
					username: company.username
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
    update = async (req: Request, res: Response) => {
		const { number_of_store, target_customer, size } = req.body;
		const company = await this.companiesService.updateCompany(
            number_of_store, target_customer, size
		);

		if (!number_of_store || !target_customer || !size) {
			res.status(400).json({ message: "missing information" });
		} else {
			res.json({ message: "login success", data:company })
		}
	};
}
