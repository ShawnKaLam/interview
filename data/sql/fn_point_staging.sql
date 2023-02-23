CREATE OR REPLACE FUNCTION insert_to_point_staging() RETURNS trigger AS $$
    DECLARE
        dim_customer_id integer;
        dim_date_id integer;
    BEGIN
        INSERT INTO customer_dim (gender,yob,mob,occupation,income_group,region,customer_id,customer_created_at) VALUES
            (NEW.gender,NEW.yob,NEW.mob,NEW.occupation,NEW.income_group,NEW.region,NEW.customer_id,NEW.customer_created_at) ON CONFLICT(gender,yob,mob,occupation,income_group,region,customer_id,customer_created_at)
            DO UPDATE set updated_at = NOW() RETURNING id into dim_customer_id;

        INSERT INTO date_dim (date,year,month,day,weekday,quarter) VALUES 
            (NEW.date, NEW.year,NEW.month,NEW.day,NEW.weekday,NEW.quarter) on conflict(date, year,month,day,weekday,quarter)
            DO UPDATE set updated_at = NOW() RETURNING id into dim_date_id;

        INSERT INTO point_fact (amount,point_type,customer_id, date_id) VALUES
            (NEW.amount, NEW.point_type, dim_customer_id, dim_date_id);

        return NEW;
    END
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_trigger AFTER INSERT ON point_staging
FOR EACH ROW EXECUTE PROCEDURE insert_to_point_staging();