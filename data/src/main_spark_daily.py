from config import cfg
from etl_postgres.daily import initialise, insert_points, insert_coupons, insert_transactions

if __name__ == "__main__":
    spark = initialise()
    insert_points(spark=spark)
    insert_coupons(spark=spark)
    insert_transactions(spark=spark)