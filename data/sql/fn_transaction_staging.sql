CREATE OR REPLACE FUNCTION insert_to_transaction_staging() RETURNS trigger AS $$
    DECLARE
        dim_customer_id integer;
        dim_date_id integer;
        dim_company_id integer;
        dim_store_id integer;
    BEGIN
        INSERT INTO customer_dim (gender,yob,mob,occupation,income_group,region,customer_id,customer_created_at) VALUES
            (NEW.gender,NEW.yob,NEW.mob,NEW.occupation,NEW.income_group,NEW.region,NEW.customer_id,NEW.customer_created_at) ON CONFLICT(gender,yob,mob,occupation,income_group,region,customer_id,customer_created_at)
            DO UPDATE set updated_at = NOW() RETURNING id into dim_customer_id;

        INSERT INTO date_dim (date,year,month,day,weekday,quarter) VALUES 
            (NEW.date, NEW.year,NEW.month,NEW.day,NEW.weekday,NEW.quarter) on conflict(date, year,month,day,weekday,quarter)
            DO UPDATE set updated_at = NOW() RETURNING id into dim_date_id;

        INSERT INTO company_dim (company_name, company_type, category, number_of_store, target_customer, company_size, found_date, company_id) VALUES
            (NEW.company_name, NEW.company_type, NEW.category, NEW.number_of_store, NEW.target_customer, NEW.company_size, NEW.found_date, NEW.company_id) ON CONFLICT(company_name, company_type, category, number_of_store, target_customer, company_size, found_date, company_id)
            DO UPDATE set updated_at = NOW() RETURNING id into dim_company_id;

        INSERT INTO store_dim (store_name, location, store_size, store_id) VALUES
            (NEW.store_name, NEW.location, NEW.store_size, NEW.store_id) ON CONFLICT(store_name, location, store_size, store_id)
            DO UPDATE set updated_at = NOW() RETURNING id into dim_store_id;

        INSERT INTO transaction_fact (amount, payment_method, collect_point, customer_id, date_id, company_id, store_id) VALUES
            (NEW.amount, NEW.payment_method, NEW.collect_point, dim_customer_id, dim_date_id, dim_company_id, dim_store_id);

        return NEW;
    END
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_trigger AFTER INSERT ON transaction_staging
FOR EACH ROW EXECUTE PROCEDURE insert_to_transaction_staging();