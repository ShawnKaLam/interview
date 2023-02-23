CREATE OR REPLACE FUNCTION insert_to_coupon_staging() RETURNS trigger AS $$
    DECLARE
        dim_promotion_id integer;
        dim_listing_id integer;
        dim_customer_id integer;
        dim_date_id integer;
    BEGIN
        INSERT INTO customer_dim (gender,yob,mob,occupation,income_group,region,customer_id,customer_created_at) VALUES
            (NEW.gender,NEW.yob,NEW.mob,NEW.occupation,NEW.income_group,NEW.region,NEW.customer_id,NEW.customer_created_at) ON CONFLICT(gender,yob,mob,occupation,income_group,region,customer_id,customer_created_at)
            DO UPDATE set updated_at = NOW() RETURNING id into dim_customer_id;

        INSERT INTO date_dim (date,year,month,day,weekday,quarter) VALUES 
            (NEW.date, NEW.year,NEW.month,NEW.day,NEW.weekday,NEW.quarter) on conflict(date, year,month,day,weekday,quarter)
            DO UPDATE set updated_at = NOW() RETURNING id into dim_date_id;

        INSERT INTO promotion_dim (discount,promotion_type,promotion_id) VALUES 
            (NEW.discount,NEW.promotion_type,NEW.promotion_id) on conflict(discount,promotion_type,promotion_id)
            DO UPDATE set updated_at = NOW() RETURNING id into dim_promotion_id;

        INSERT INTO listing_dim (points_required,coupon_type,coupon_name,listing_id) VALUES 
            (NEW.points_required,NEW.coupon_type,NEW.coupon_name, NEW.listing_id) on conflict(points_required,coupon_type,coupon_name,listing_id)
            DO UPDATE set updated_at = NOW() RETURNING id into dim_listing_id;

        INSERT INTO coupon_fact (total,quantity,customer_id,date_id,promotion_id,listing_id) VALUES
            (NEW.total, NEW.quantity,dim_customer_id,dim_date_id,dim_promotion_id,dim_listing_id);

        return NEW;
    END
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_trigger AFTER INSERT ON coupon_staging
FOR EACH ROW EXECUTE PROCEDURE insert_to_coupon_staging();