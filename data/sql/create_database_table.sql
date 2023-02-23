CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS coupon_transactions;
DROP TABLE IF EXISTS points;
DROP TABLE IF EXISTS promotions;
DROP TABLE IF EXISTS advertisements;
DROP TABLE IF EXISTS coupons;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS coupon_listings;
DROP TABLE IF EXISTS store_users;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS admins;

CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    uuid uuid DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    phone INT NOT NULL,
    email VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    gender VARCHAR NOT NULL,
    yob INT NOT NULL,
    mob INT NOT NULL,
    occupation VARCHAR NOT NULL,
    income_group VARCHAR NOT NULL,
    region VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    number_of_store INT NOT NULL,
    target_customer VARCHAR NOT NULL,
    company_type VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    found_date DATE NOT NULL,
    size VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE store_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    location VARCHAR NOT NULL,
    size INT NOT NULL,
    company_id INT NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE coupon_listings (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT NOT NULL,
    coupon_type VARCHAR NOT NULL,
    points_required INT NOT NULL,
    valid_start DATE NOT NULL,
    valid_end DATE NOT NULL,
    is_deleted BOOLEAN DEFAULT false NOT NULL,
    company_id INT NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    transaction_date TIMESTAMP DEFAULT NOW() NOT NULL,
    amount INT NOT NULL,
    payment_method VARCHAR NOT NULL,
    collect_point BOOLEAN NOT NULL,
    is_refund BOOLEAN DEFAULT false NOT NULL,
    store_user_id INT NOT NULL,
    FOREIGN KEY (store_user_id) REFERENCES store_users(id),
    customer_id INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);


CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    transaction_date TIMESTAMP DEFAULT NOW() NOT NULL,
    name VARCHAR NOT NULL,
    description TEXT NOT NULL,
    expiry DATE NOT NULL,
    is_used BOOLEAN DEFAULT false NOT NULL,
    is_expired BOOLEAN DEFAULT false NOT NULL,
    customer_id INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);


CREATE TABLE promotions (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT NOT NULL,
    discount INT NOT NULL,
    promotion_type VARCHAR NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_deleted BOOLEAN DEFAULT false NOT NULL,
    listing_id INT NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES coupon_listings(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE points (
    id SERIAL PRIMARY KEY,
    amount INT NOT NULL,
    point_type VARCHAR NOT NULL,
    transaction_date TIMESTAMP DEFAULT NOW() NOT NULL,
    customer_id INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE coupon_transactions (
    id SERIAL PRIMARY KEY,
    uuid uuid DEFAULT uuid_generate_v4(),
    total INT NOT NULL,
    quantity INT NOT NULL,
    transaction_date TIMESTAMP DEFAULT NOW() NOT NULL,
    customer_id INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    listing_id INT NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES coupon_listings(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

