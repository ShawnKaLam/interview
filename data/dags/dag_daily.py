import pip

def _pip_install():
    pip.main(['install', '-r', '/opt/airflow/dags/requirements.txt'])




from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from airflow.operators.empty import EmptyOperator
from airflow import DAG
import datetime
default_args={
    'owner': "Shawn",
    'email': ['billylau13579@gmail.com']
}


dag = DAG(
    dag_id='01_daily',
    start_date=datetime.datetime(2023, 2, 23),
    end_date=datetime.datetime(2023, 4, 1),
    default_args=default_args,
    schedule_interval="15 8 * * *"
)



def _setup():
    from dotenv import load_dotenv
    load_dotenv()
    import os
    GOOGLE_APPLICATION_CREDENTIALS :str = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    return GOOGLE_APPLICATION_CREDENTIALS

def _insert_customers():
    import psycopg2 as psycopg
    from dotenv import load_dotenv
    load_dotenv()
    import os
    POSTGRES_HOST_APP :str = os.getenv('POSTGRES_HOST_APP')
    POSTGRES_HOST_WARE :str = os.getenv('POSTGRES_HOST_WARE')
    POSTGRES_USER_APP :str = os.getenv('POSTGRES_USER_APP')
    POSTGRES_USER_WARE :str = os.getenv('POSTGRES_USER_WARE')
    POSTGRES_PASSWORD :str = os.getenv('POSTGRES_PASSWORD')
    POSTGRES_DB_APP :str = os.getenv('POSTGRES_DB_APP')
    POSTGRES_DB_WARE :str = os.getenv('POSTGRES_DB_WARE')
    conn_app = psycopg.connect(dbname=POSTGRES_DB_APP,user=POSTGRES_USER_APP,
                        password=POSTGRES_PASSWORD,host=POSTGRES_HOST_APP, port=5432)

    conn_ware = psycopg.connect(dbname=POSTGRES_DB_WARE,user=POSTGRES_USER_WARE,
                        password=POSTGRES_PASSWORD,host=POSTGRES_HOST_WARE, port=5431)
    conn_app.autocommit = True
    conn_ware.autocommit = True
    cur_app = conn_app.cursor()
    cur_ware = conn_ware.cursor()
    query = """
        SELECT
        id as customer_id,
        gender,
        yob,
        mob,
        occupation,
        income_group,
        region,
        created_at as customer_created_at
        FROM customers
        WHERE created_at::date = current_date -1
    """ 
    cur_app.execute(query)
    customer_result = cur_app.fetchall()
    cur_ware.executemany("INSERT INTO customer_dim (customer_id, gender, yob, mob, occupation, income_group,region,customer_created_at) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)", customer_result)

def _insert_points():
    import psycopg2 as psycopg
    from google.cloud import bigquery
    from dotenv import load_dotenv
    load_dotenv()
    import os
    POSTGRES_HOST_WARE :str = os.getenv('POSTGRES_HOST_WARE')
    POSTGRES_USER_WARE :str = os.getenv('POSTGRES_USER_WARE')
    POSTGRES_PASSWORD :str = os.getenv('POSTGRES_PASSWORD')
    POSTGRES_DB_WARE :str = os.getenv('POSTGRES_DB_WARE')
    conn_ware = psycopg.connect(dbname=POSTGRES_DB_WARE,user=POSTGRES_USER_WARE,
                        password=POSTGRES_PASSWORD,host=POSTGRES_HOST_WARE, port=5431)
    conn_ware.autocommit = True
    cur_ware = conn_ware.cursor()
    client = bigquery.Client()
    points_table = client.get_table('zeta-medley-376406.capstonepjt.points')

    query = """
        SELECT
        amount,
        date::text,
        point_type,
        gender,
        yob,
        mob,
        occupation,
        income_group,
        region,
        to_char(customer_created_at, 'YYYY-MM-DD') customer_created_at
        FROM point_staging
        WHERE date::date = current_date -1
    """
    cur_ware.execute(query)
    point_results = cur_ware.fetchall()
    for result_list in point_results:
        client.insert_rows(points_table, [result_list])

def _insert_coupons():
    import psycopg2 as psycopg
    from google.cloud import bigquery
    from dotenv import load_dotenv
    load_dotenv()
    import os
    POSTGRES_HOST_WARE :str = os.getenv('POSTGRES_HOST_WARE')
    POSTGRES_USER_WARE :str = os.getenv('POSTGRES_USER_WARE')
    POSTGRES_PASSWORD :str = os.getenv('POSTGRES_PASSWORD')
    POSTGRES_DB_WARE :str = os.getenv('POSTGRES_DB_WARE')
    conn_ware = psycopg.connect(dbname=POSTGRES_DB_WARE,user=POSTGRES_USER_WARE,
                        password=POSTGRES_PASSWORD,host=POSTGRES_HOST_WARE, port=5431)
    conn_ware.autocommit = True
    cur_ware = conn_ware.cursor()
    client = bigquery.Client()
    coupons_table = client.get_table('zeta-medley-376406.capstonepjt.coupons')
    query = """
        SELECT
        total,
        quantity,
        date::text,
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
        WHERE date::date = current_date -1
    """

    cur_ware.execute(query)
    coupon_results = cur_ware.fetchall()
    for result_list in coupon_results:
        client.insert_rows(coupons_table, [result_list])

def _insert_transactions():
    import psycopg2 as psycopg
    from google.cloud import bigquery
    from dotenv import load_dotenv
    load_dotenv()
    import os
    POSTGRES_HOST_WARE :str = os.getenv('POSTGRES_HOST_WARE')
    POSTGRES_USER_WARE :str = os.getenv('POSTGRES_USER_WARE')
    POSTGRES_PASSWORD :str = os.getenv('POSTGRES_PASSWORD')
    POSTGRES_DB_WARE :str = os.getenv('POSTGRES_DB_WARE')
    conn_ware = psycopg.connect(dbname=POSTGRES_DB_WARE,user=POSTGRES_USER_WARE,
                        password=POSTGRES_PASSWORD,host=POSTGRES_HOST_WARE, port=5431)
    conn_ware.autocommit = True
    cur_ware = conn_ware.cursor()
    client = bigquery.Client()
    transactions_table = client.get_table('zeta-medley-376406.capstonepjt.transactions')
    query = """
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
        date::text,
        company_name,
        company_type,
        category,
        number_of_store,
        target_customer,
        company_size,
        found_date::text,
        store_name,
        location,
        store_size
        FROM transaction_staging
        WHERE date::date = current_date -1
    """

    cur_ware.execute(query)
    transaction_results = cur_ware.fetchall()
    for result_list in transaction_results:
        client.insert_rows(transactions_table, [result_list])


pip_install= PythonOperator(
    task_id="pip_install",
    python_callable=_pip_install,
    dag=dag
)
setup = PythonOperator(
    task_id="setup",
    python_callable=_setup,
    dag=dag
)
insert_customers = PythonOperator(
    task_id="insert_customers",
    python_callable=_insert_customers,
    dag=dag
)
insert_points = PythonOperator(
    task_id="insert_points",
    python_callable=_insert_points,
    dag=dag
)
insert_coupons = PythonOperator(
    task_id="insert_coupons",
    python_callable=_insert_coupons,
    dag=dag
)
insert_transactions = PythonOperator(
    task_id="insert_transactions",
    python_callable=_insert_transactions,
    dag=dag
)


start = EmptyOperator(
    task_id="start",
    dag=dag
)
end = EmptyOperator(
    task_id='end',
    dag=dag
)


start >> pip_install >> setup >> insert_customers >> insert_points >> insert_coupons >> insert_transactions >> end