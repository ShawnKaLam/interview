import { Knex } from "knex";
import { Coupons } from "./model";

export class CouponsService {
	constructor(private dbClient: Knex) {} 
        async getCoupon(customer_id: number) {
            const getCoupons = await this.dbClient<Coupons>("coupons")
                .select("*")
                .where("customer_id", customer_id)
            return getCoupons;
        }

        async createCoupon(	transaction_date: string,
            name: string,
            description: string,
            expiry: string,
            is_used: boolean,
            is_expired: boolean,
            customer_id: number) {
                const insertData = {transaction_date, name, description, expiry,is_used, is_expired, customer_id}
                const result = await this.dbClient("coupons")
                .insert(insertData)
                .returning("id");
                return result[0].id;
            }
    }