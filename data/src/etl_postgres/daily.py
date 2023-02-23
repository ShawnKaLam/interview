from pyspark.sql import DataFrame
from config import cfg
from pyspark.sql import SparkSession



def initialise():
    packages = [
        "org.postgresql:postgresql:42.2.18"
        ]
    spark = SparkSession.builder.appName('ETL from Postgresql to Postgresql')\
            .master(f"spark://{cfg.SPARK_MASTER}:7077")\
            .config("spark.jars.packages",",".join(packages))\
            .getOrCreate()
    return spark

def insert_points(spark):
    query = """
        (SELECT 
            points.amount,
            points.point_type,
            points.transaction_date,
            customers.id AS customer_id, 
            customers.gender,
            customers.yob,
            customers.mob,
            customers.occupation,
            customers.income_group,
            customers.region,
            customers.created_at as customer_created_at
        FROM customers
        LEFT OUTER JOIN points ON points.customer_id = customers.id
        WHERE transaction_date::date = current_date -1)
        point
        """

    df = spark.read.format('jdbc') \
            .option('url',f"jdbc:postgresql://{cfg.POSTGRES_HOST_APP}:5432/{cfg.POSTGRES_DB_APP}")\
            .option('dbtable', query)\
            .option('user', cfg.POSTGRES_USER_APP)\
            .option('password', cfg.POSTGRES_PASSWORD)\
            .option('driver','org.postgresql.Driver').load()

    df.createOrReplaceTempView('point_table')
    df_to_dw = spark.sql("""
        SELECT
            transaction_date as date,
            EXTRACT (year FROM transaction_date) AS year,
            EXTRACT (month FROM transaction_date) AS month,
            EXTRACT (day FROM transaction_date) AS day,
            EXTRACT (dow FROM transaction_date) AS weekday,
            EXTRACT (quarter FROM transaction_date) AS quarter,
            customer_id,
            gender,
            yob,
            mob,
            occupation,
            income_group,
            region,
            amount,
            point_type,
            customer_created_at
        FROM point_table
    """)

    df_to_dw.write.format('jdbc') \
            .option('url',f"jdbc:postgresql://{cfg.POSTGRES_HOST_WARE}:5432/{cfg.POSTGRES_DB_WARE}")\
            .option('dbtable', 'point_staging')\
            .option('user', cfg.POSTGRES_USER_WARE)\
            .option('password', cfg.POSTGRES_PASSWORD)\
            .option('driver','org.postgresql.Driver')\
            .mode('append')\
            .save()

def insert_coupons(spark):
    query = """
        (SELECT 
            coupon_transactions.total,
            coupon_transactions.quantity,
            coupon_transactions.transaction_date,
            customers.id AS customer_id, 
            customers.gender,
            customers.yob,
            customers.mob,
            customers.occupation,
            customers.income_group,
            customers.region,
            customers.created_at as customer_created_at,
            coupon_listings.id as listing_id,
            coupon_listings.name as coupon_name,
            coupon_listings.points_required,
            coupon_listings.coupon_type,
            promotions.discount,
            promotions.promotion_type,
            promotions.id as promotion_id
        FROM customers
        LEFT OUTER JOIN coupon_transactions ON coupon_transactions.customer_id = customers.id
        INNER JOIN coupon_listings on coupon_listings.id = coupon_transactions.listing_id
        LEFT OUTER JOIN promotions on promotions.listing_id = coupon_listings.id
        WHERE transaction_date::date = current_date -1)
        coupon
        """

    df = spark.read.format('jdbc') \
            .option('url',f"jdbc:postgresql://{cfg.POSTGRES_HOST_APP}:5432/{cfg.POSTGRES_DB_APP}")\
            .option('dbtable', query)\
            .option('user', cfg.POSTGRES_USER_APP)\
            .option('password', cfg.POSTGRES_PASSWORD)\
            .option('driver','org.postgresql.Driver').load()
    df.createOrReplaceTempView('coupon_table')
    df_to_dw = spark.sql("""
        SELECT
            transaction_date as date,
            EXTRACT (year FROM transaction_date) AS year,
            EXTRACT (month FROM transaction_date) AS month,
            EXTRACT (day FROM transaction_date) AS day,
            EXTRACT (dow FROM transaction_date) AS weekday,
            EXTRACT (quarter FROM transaction_date) AS quarter,
            customer_id,
            gender,
            yob,
            mob,
            occupation,
            income_group,
            region,
            total,
            quantity,
            customer_created_at,
            listing_id,
            coupon_name,
            points_required,
            coupon_type,
            discount,
            promotion_type,
            promotion_id
        FROM coupon_table
    """)

    df_to_dw.write.format('jdbc') \
            .option('url',f"jdbc:postgresql://{cfg.POSTGRES_HOST_WARE}:5432/{cfg.POSTGRES_DB_WARE}")\
            .option('dbtable', 'coupon_staging')\
            .option('user', cfg.POSTGRES_USER_WARE)\
            .option('password', cfg.POSTGRES_PASSWORD)\
            .option('driver','org.postgresql.Driver')\
            .mode('append')\
            .save()

def insert_transactions(spark):
    query = """
        (SELECT 
            transactions.amount,
            transactions.payment_method,
            transactions.collect_point,
            transactions.transaction_date,
            customers.id AS customer_id, 
            customers.gender,
            customers.yob,
            customers.mob,
            customers.occupation,
            customers.income_group,
            customers.region,
            customers.created_at as customer_created_at,
            store_users.id AS store_id,
            store_users.name AS store_name,
            store_users.location,
            store_users.size AS store_size,
            companies.id AS company_id,
            companies.name AS company_name,
            companies.company_type,
            companies.category,
            companies.number_of_store,
            companies.target_customer,
            companies.size AS company_size,
            companies.found_date AS found_date
        FROM customers
        LEFT OUTER JOIN transactions ON transactions.customer_id = customers.id
        RIGHT OUTER JOIN store_users on store_users.id = transactions.store_user_id
        INNER JOIN companies on companies.id = store_users.company_id
        WHERE transaction_date::date = current_date -1)
        transaction
        """

    df = spark.read.format('jdbc') \
            .option('url',f"jdbc:postgresql://{cfg.POSTGRES_HOST_APP}:5432/{cfg.POSTGRES_DB_APP}")\
            .option('dbtable', query)\
            .option('user', cfg.POSTGRES_USER_APP)\
            .option('password', cfg.POSTGRES_PASSWORD)\
            .option('driver','org.postgresql.Driver').load()

    df.createOrReplaceTempView('transaction_table')
    df_to_dw = spark.sql("""
        SELECT
            transaction_date as date,
            EXTRACT (year FROM transaction_date) AS year,
            EXTRACT (month FROM transaction_date) AS month,
            EXTRACT (day FROM transaction_date) AS day,
            EXTRACT (dow FROM transaction_date) AS weekday,
            EXTRACT (quarter FROM transaction_date) AS quarter,
            amount,
            payment_method,
            collect_point,
            customer_id,
            gender,
            yob,
            mob,
            occupation,
            income_group,
            region,
            customer_created_at,
            store_id,
            store_name,
            location,
            store_size,
            company_id,
            company_name,
            company_type,
            category,
            number_of_store,
            target_customer,
            company_size,
            found_date,
        FROM transaction_table
    """)

    df_to_dw.write.format('jdbc') \
            .option('url',f"jdbc:postgresql://{cfg.POSTGRES_HOST_WARE}:5432/{cfg.POSTGRES_DB_WARE}")\
            .option('dbtable', 'transaction_staging')\
            .option('user', cfg.POSTGRES_USER_WARE)\
            .option('password', cfg.POSTGRES_PASSWORD)\
            .option('driver','org.postgresql.Driver')\
            .mode('append')\
            .save()