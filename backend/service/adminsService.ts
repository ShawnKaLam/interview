import { Knex } from "knex";
// import { ApplicationError } from "../utils/error";
// import {  hashPassword } from "../utils/hash";
import { Admins } from "./model";

export class AdminsService {
	constructor(private dbClient: Knex) {}

	async getAdmin(username: string) {
		const getAdmin = await this.dbClient("admins")
			.select("username")
			.where({ username: username });

		return getAdmin;
	}

    async checkAdmin(username: string ) {
		const admin = await this.dbClient.select("*")
		.from<Admins>("admins")
			.where({ username: username })
			.first(["id", "username", "password"]);
			return admin;
		// if (customer && (await checkPassword(password, customer.password))) {
		// }
		// throw new InvalidInfoError();
	}
}