import { Knex } from "knex";
import { ApplicationError } from "../utils/error";
import { hashPassword } from "../utils/hash";
import { Stores } from "./model";

export class StoresService {
	constructor(private dbClient: Knex) {}

	async getStore(username: string) {
		const getStore = await this.dbClient("store_users")
			.select("username")
			.where({ username: username });
		return getStore;
	}

	async getStoreByID(id: string) {
		const getStore = await this.dbClient<Stores>("store_users")
			.select("*")
			.where("id", id)
			.first();

		return getStore;
	}

	async createStore(
		name: string,
		username: string,
		password: string,
		location: string,
		size: string,
		company_id: number
	) {
		const store = await this.dbClient("store_users")
			.where("username", "=", username)
			.first([
				"id",
				"name",
				"username",
				"password",
				"location",
				"size",
				"company_id"
			]);
		if (!store) {
			password = await hashPassword(password);
			const insertData = {
				name,
				username,
				password,
				location,
				size,
				company_id
			};
			const result = await this.dbClient("store_users")
				.insert(insertData)
				.returning("id");
			return result[0].id;
		}
		throw new ApplicationError("Duplicated Store", 400);
	}

	async checkStore(username: string) {
		const store = await this.dbClient<Stores>("store_users")
			.where({ username: username })
			.first(["id", "username", "password"]);
		return store;
	}
}
