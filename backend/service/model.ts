export interface Customer {
	id: number;
	uuid: string;
	name: string;
	email: string;
	username: string;
	password: string;
	phone: number;
	year_of_birth?: number;
	month_of_birth?: number;
	// age?: number;
	gender?: number;
	occupation?: string;
	income_group?: string;
	region?: string;
	qrcode?: string;
}

export interface Companies {
	id: number;
	name: string;
	username: string;
	password: string;
	number_of_store: number;
	target_customer: string;
	company_type: string;
	category: string;
	found_date: Date;
	size: string;
}
export interface Stores {
	id: number;
	name: string;
	username: string;
	password: string;
	location: string;
	size: string;
	company_id: number;
}

export interface Admins {
	id:number;
	username: string;
	password: string;
}

export interface Transactions {
	id: number;
	transaction_date: string;
	amount: number;
	payment_method: string;
	collect_point: boolean;
	is_refund: boolean;
	store_id: number;
	customer_id: number;
}

export interface Promotions {
	id: number;
	name: string;
	description: string;
	discount: number;
	promotion_type: string;
	start_date: string;
	end_date: string;
	is_deleted: boolean;
	listing_id: number;
}

export interface Listings {
	id: number;
	name: string;
	description: string;
	coupon_type: string;
	points_required: number;
	valid_start: Date;
	valid_end: Date;
	is_deleted: boolean;
	company_id: number;
}

export interface Points {
	id: number;
	amount: number;
	point_type: string;
	transaction_date: string;
	uuid: string,
	customer_id: number;
}

export interface Coupontransactions {
	id: number;
	total: number;
	quantity: number;
	transaction_date: string;
	customer_id: number;
	listing_id: number;
}

export interface Coupons {
	id: number;
	transaction_date: string;
	name: string;
	description: string;
	expiry: string;
	is_used: boolean;
	is_expired: boolean;
	customer_id: number;
}