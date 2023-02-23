DROP TABLE IF EXISTS transaction_fact;
DROP TABLE IF EXISTS point_fact;
DROP TABLE IF EXISTS coupon_fact;
DROP TABLE IF EXISTS store_dim;
DROP TABLE IF EXISTS company_dim;
DROP TABLE IF EXISTS date_dim;
DROP TABLE IF EXISTS customer_dim;
DROP TABLE IF EXISTS listing_dim;
DROP TABLE IF EXISTS promotion_dim;
DROP TABLE IF EXISTS transaction_staging;
DROP TABLE IF EXISTS coupon_staging;
DROP TABLE IF EXISTS point_staging;


CREATE TABLE point_staging(
id SERIAL PRIMARY KEY,
amount INT,
point_type VARCHAR,
gender VARCHAR,
yob INT,
mob INT,
occupation VARCHAR,
income_group VARCHAR,
region VARCHAR,
customer_id INT,
customer_created_at TIMESTAMP,
date DATE,
year INT,
month INT,
day INT,
weekday INT,
quarter INT
);

CREATE TABLE coupon_staging(
id SERIAL PRIMARY KEY,
total INT,
quantity INT,
gender VARCHAR,
yob INT,
mob INT,
occupation VARCHAR,
income_group VARCHAR,
region VARCHAR,
customer_id INT,
customer_created_at TIMESTAMP,
date DATE,
year INT,
month INT,
day INT,
weekday INT,
quarter INT,
coupon_name VARCHAR,
points_required INT,
coupon_type VARCHAR,
discount INT,
promotion_type VARCHAR,
listing_id INT,
promotion_id INT
);

CREATE TABLE transaction_staging(
id SERIAL PRIMARY KEY,
amount INT,
payment_method VARCHAR,
collect_point boolean,
gender VARCHAR,
yob INT,
mob INT,
occupation VARCHAR,
income_group VARCHAR,
region VARCHAR,
customer_id INT,
customer_created_at TIMESTAMP,
date DATE,
year INT,
month INT,
day INT,
weekday INT,
quarter INT,
company_name VARCHAR,
company_type VARCHAR,
category VARCHAR,
number_of_store INT,
target_customer VARCHAR,
company_size VARCHAR,
found_date DATE,
company_id INT,
store_id INT,
store_name VARCHAR,
location VARCHAR,
store_size INT
);

CREATE TABLE promotion_dim(
id SERIAL PRIMARY KEY,
promotion_id INT,
discount varchar,
promotion_type varchar,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX promotion_unique_idx on promotion_dim (discount, promotion_type,promotion_id);

CREATE TABLE listing_dim(
id SERIAL PRIMARY KEY,
listing_id INT,
coupon_name varchar,
points_required integer,
coupon_type varchar,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX coupon_unique_idx on listing_dim (points_required, coupon_type, coupon_name, listing_id);

CREATE TABLE customer_dim(
id SERIAL PRIMARY KEY,
customer_id INT,
gender varchar,
yob integer,
mob integer,
occupation varchar,
income_group varchar,
region varchar,
customer_created_at TIMESTAMP,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX customer_unique_idx on customer_dim (gender, yob, mob, occupation, income_group, region, customer_id, customer_created_at);

CREATE TABLE date_dim(
id SERIAL PRIMARY KEY,
date DATE,
year integer,
month integer,
day integer,
weekday integer,
quarter integer,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX date_unique_idx on date_dim (date,year,month,day,weekday,quarter);

CREATE TABLE company_dim(
id SERIAL PRIMARY KEY,
company_id INT,
company_name varchar,
company_type varchar,
category varchar,
number_of_store integer,
target_customer varchar,
company_size varchar,
found_date date,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX company_unique_idx on company_dim (company_name, company_type, category, number_of_store, target_customer, company_size, found_date, company_id);

CREATE TABLE store_dim(
id SERIAL PRIMARY KEY,
store_id INT,
store_name varchar,
location varchar,
store_size integer,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX store_unique_idx on store_dim (store_name, location, store_size, store_id);

CREATE TABLE coupon_fact(
id SERIAL PRIMARY KEY,
total integer,
quantity integer,
customer_id integer,
foreign key (customer_id) references customer_dim(id),
date_id integer,
foreign key (date_id) references date_dim(id),
listing_id integer,
foreign key (listing_id) references listing_dim(id),
promotion_id integer,
foreign key (promotion_id) references promotion_dim(id),
created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE point_fact(
id SERIAL PRIMARY KEY,
amount integer,
point_type varchar,
customer_id integer,
foreign key (customer_id) references customer_dim(id),
date_id integer,
foreign key (date_id) references date_dim(id),
created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transaction_fact(
id SERIAL PRIMARY KEY,
amount integer,
payment_method varchar,
collect_point boolean,
customer_id integer,
foreign key (customer_id) references customer_dim(id),
date_id integer,
foreign key (date_id) references date_dim(id),
company_id integer,
foreign key (company_id) references company_dim(id),
store_id integer,
foreign key (store_id) references store_dim(id),
created_at TIMESTAMP DEFAULT NOW()
);