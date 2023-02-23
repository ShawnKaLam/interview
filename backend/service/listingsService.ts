import { Knex } from "knex";
import { Listings } from "./model";

export class ListingsService {
	constructor(private dbClient: Knex) {}

	async getListing() {
		const getListing = await this.dbClient("coupon_listings")
			.select("*")
		return getListing;
	}

	async getListingByID(company_id: number) {
		const getListing = await this.dbClient<Listings>("coupon_listings")
			.select("*")
			.where("company_id", company_id)

		return getListing;
	}

    async createListing(
        name: string,
        description: string,
        coupon_type: string,
        points_required: number,
        valid_start: Date,
        valid_end: Date,
        company_id: number
    ) {
        const insertData = { name, description , coupon_type, points_required, valid_start, valid_end, company_id}
        const result = await this.dbClient("coupon_listings")
        .insert(insertData)
        .returning("id");
        return result[0].id;
    }

    async deleteListing(id: number) {
        const result = await this.dbClient("coupon_listings")
        .update({"is_deleted": true})
        .where("id", id)
        return result[0].id
    }
    }
