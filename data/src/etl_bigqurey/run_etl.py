import psycopg2 as psycopg
from config import Config
from google.cloud import bigquery


def connect(cfg: Config):
    conn_ware = psycopg.connect(dbname=cfg.POSTGRES_DB_WARE,user=cfg.POSTGRES_USER_WARE,
                            password=cfg.POSTGRES_PASSWORD,host=cfg.POSTGRES_HOST_WARE)

    conn_ware.autocommit = True
    cur_ware = conn_ware.cursor()
    client = bigquery.Client()
    return cur_ware, client
    
def get_big_query_table(big_query_client, table_name):
    table = big_query_client.get_table(f'zeta-medley-376406.capstonepjt.{table_name}')
    return table

def insert_points(cur_ware, client):
    get_sql = """
        SELECT
        amount,
        date:: text,
        point_type,
        gender,
        yob,
        mob,
        occupation,
        income_group,
        region,
        to_char(customer_created_at, 'YYYY-MM-DD') customer_created_at
        FROM point_staging
    """

    cur_ware.execute(get_sql)
    results = cur_ware.fetchall()
    table = get_big_query_table(client, table_name="points")
    for result_list in results:
        client.insert_rows(table, [result_list])

def insert_coupons(cur_ware, client):
    get_sql = """
        SELECT
        total,
        quantity,
        date:: text,
        gender,
        yob,
        mob,
        occupation,
        income_group,
        region,
        to_char(customer_created_at, 'YYYY-MM-DD') customer_created_at,
        coupon_name,
        points_required,
        coupon_type,
        discount
        FROM coupon_staging
    """
    cur_ware.execute(get_sql)
    results = cur_ware.fetchall()
    table = get_big_query_table(client, table_name="coupons")
    for result_list in results:
        client.insert_rows(table, [result_list])

def insert_transactions(cur_ware, client):
    get_sql = """
        SELECT
        amount,
        payment_method,
        collect_point,
        gender,
        yob,
        mob,
        occupation,
        income_group,
        region,
        to_char(customer_created_at, 'YYYY-MM-DD') customer_created_at,
        date:: text,
        company_name,
        company_type,
        category,
        number_of_store,
        target_customer,
        company_size,
        found_date:: text,
        store_name,
        location,
        store_size
        FROM transaction_staging
    """

    cur_ware.execute(get_sql)
    results = cur_ware.fetchall()
    table = get_big_query_table(client, table_name="transactions")
    for result_list in results:
        client.insert_rows(table, [result_list])
