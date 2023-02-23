import { Knex } from "knex";
import { ApplicationError } from "../utils/error";
import {  hashPassword } from "../utils/hash";
import { Companies } from "./model";

export class CompaniesService {
	constructor(private dbClient: Knex) {}
	async showCompany(){
		const showCompany = await this.dbClient("companies")
		.select('*')
		return showCompany
	}
	async getCompany(username: string) {
		const getCompany = await this.dbClient("companies")
			.select("username")
			.where({ username: username });
		return getCompany;
	}

	async getCompanyByID(id: string) {
		const getCompany = await this.dbClient<Companies>("companies")
			.select("*")
			.where("id", id)
			.first();

		return getCompany;
	}

	async createCompany(
		name: string,
		username: string,
		password: string,
		number_of_store: number,
        target_customer: string,
        company_type: string,
        found_date: Date,
        size: string
	) {
		const company = await this.dbClient("companies")
			.where("username", "=", username)
			.first(["id", "name", "username", "password", "number_of_store","target_customer","company_type","found_date","size"]);
		if (!company) {
			password = await hashPassword(password);
			const insertData = { name, username, password, number_of_store, target_customer, company_type, found_date, size };
			const result = await this.dbClient("companies")
				.insert(insertData)
				.returning("id");
			return result[0].id;
		}
		throw new ApplicationError("Duplicated Company", 400);
	}

	async checkCompany(username: string ) {
		const company = await this.dbClient.select("*")
		.from<Companies>("companies")
			.where({ username: username })
			.first(["id", "username", "password"]);
			return company;
		// if (customer && (await checkPassword(password, customer.password))) {
		// }
		// throw new InvalidInfoError();
	}

    async updateCompany(number_of_store: number, target_customer: string, size: string){
        const result = await this.dbClient("companies").update({
            number_of_store: number_of_store,
            target_customer: target_customer,
            size: size
        })
            return result
    }
}
