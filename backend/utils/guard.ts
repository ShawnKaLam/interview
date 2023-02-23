import jwt from "./jwt";
import jwtSimple from "jwt-simple";
import Express from "express";
import { customersService, storesService } from "../routes";
import { Bearer } from "permit";

const permit = new Bearer({ query: "access_token" });

export async function isCustomerLoggedIn(
	req: Express.Request,
	res: Express.Response,
	next: Express.NextFunction
) {
	try {
		const token = permit.check(req);
		if (!token) {
			return res.status(401).json({ msg: "Permission Denied" });
		}
		const payload = jwtSimple.decode(token, jwt.jwtSecret);
		const customer = await customersService.getCustomerIdByUUID(payload.uuid);
		if (customer) {
			const { password, ...others } = customer;
			req["user"] = { ...others };
			return next();
		} else {
			return res.status(401).json({ msg: "Permission Denied" });
		}
	} catch (error) {
		return res.status(401).json({ msg: "Permission Denied" });
	}
}

export async function isStoreLoggedIn(
	req: Express.Request,
	res: Express.Response,
	next: Express.NextFunction
) {
	try {
		const token = permit.check(req);
		if (!token) {
			console.log("asd");
			return res.status(401).json({ msg: "Permission Denied" });
		}

		const payload = jwtSimple.decode(token, jwt.jwtSecret);
		const store = await storesService.getStoreByID(payload.id);
		if (store) {
			const { password, ...others } = store;
			req["user"] = { ...others };
			return next();
		} else {
			return res.status(401).json({ msg: "Permission Denied" });
		}
	} catch (error) {
		console.error(error.message)
		return res.status(401).json({ msg: "Permission Denied" });
	}
}