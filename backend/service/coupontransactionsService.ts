import { Knex } from "knex";
import { Coupontransactions } from "./model";

export class CoupontransactionsService {
	constructor(private dbClient: Knex) {} 
        async getCoupontransaction(customer_id: number) {
            const getCoupontransactions = await this.dbClient<Coupontransactions>("coupon_transactions")
                .select("*")
                .where("customer_id", customer_id)
            return getCoupontransactions;
        }

        async createCoupontransaction(	total: number,
            quantity: number,
            transaction_date: string,
            listing_id: number,
            customer_id: number) {
                const insertData = {total, quantity, transaction_date, listing_id, customer_id}
                const result = await this.dbClient("coupon_transactions")
                .insert(insertData)
                .returning("id");
                return result[0].id;
            }
    }