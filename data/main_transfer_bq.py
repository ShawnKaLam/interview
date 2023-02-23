from src.config import cfg
from src.etl_bigqurey.run_etl import connect, insert_points, insert_coupons, insert_transactions


if __name__ == "__main__":
    # big query process
    cursor, client = connect(cfg=cfg)
    insert_points(cur_ware=cursor, client=client)
    insert_coupons(cur_ware=cursor, client=client)
    insert_transactions(cur_ware=cursor, client=client)