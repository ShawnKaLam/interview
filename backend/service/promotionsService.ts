import { Knex } from "knex";
import { Promotions } from "./model";

export class PromotionsService {
	constructor(private dbClient: Knex) {}

	async getPromotion() {
		const getPromotion = await this.dbClient("promotions")
			.select("*")
		return getPromotion;
	}

	async getPromotionByID(listing_id: number) {
		const getPromotion = await this.dbClient<Promotions>("promotions")
			.select("*")
			.where("listing_id", listing_id)

		return getPromotion;
	}

    async createPromotion(
        name: string,
        description: string,
        discount: number,
        promotion_type: string,
        start_date: string,
        end_date: string,
        listing_id: number
    ) {
        const insertData = { name, description , discount, promotion_type, start_date, end_date, listing_id}
        const result = await this.dbClient("promotions")
        .insert(insertData)
        .returning("id");
        return result[0].id;
    }

    async deletePromotion(id: number) {
        const result = await this.dbClient("promotions")
        .update({"is_deleted": true})
        .where("id", id)
        return result[0].id
    }
    }
