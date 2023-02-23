import { Knex } from "knex";
import { Points } from "./model";

export class PointsService {
	constructor(private dbClient: Knex) {}
	async getPoint(customer_id: number) {
		const getPoints = await this.dbClient<Points>("points")
			.select("*")
			.where("customer_id", customer_id);
		return getPoints;
	}

	async addPoint(
		amount: number,
		point_type: string,
		uuid: string
	) {
		let insertData: any = { amount, point_type, transaction_date:new Date() };
		const customer = await this.dbClient<{ id: number }>("customers")
			.select("id")
			.where("uuid", uuid)
			.first();

		insertData.customer_id = customer?.id;
		const result = await this.dbClient("points")
			.insert(insertData)
			.returning("id");
		return result[0].id;
	}

	async redeemByPoint(
		amount: number,
		point_type: string,
		transaction_date: string,
		customer_id: number
	) {
		const insertData = { amount, point_type, transaction_date, customer_id };
		const result = await this.dbClient("points")
			.insert(insertData)
			.returning("id");
		return result[0].id;
	}

	async showTotalPoint(uuid: number) {
		const totalPoints = await this.dbClient("points")
			.sum("points.amount")
			.join("customers", "points.customer_id", "customers.id")
			.where("customers.uuid", uuid);
		return totalPoints[0].sum;
	}
}
