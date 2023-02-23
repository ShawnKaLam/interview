from dotenv import load_dotenv
import os
load_dotenv()
from dataclasses import dataclass


@dataclass
class Config():
    SPARK_MASTER :str = str(os.getenv('SPARK_MASTER'))
    AWS_ACCESS_KEY :str = str(os.getenv('AWS_ACCESS_KEY'))
    AWS_SECRET_KEY :str = str(os.getenv('AWS_SECRET_KEY'))
    POSTGRES_HOST_APP :str = str(os.getenv('POSTGRES_HOST_APP'))
    POSTGRES_HOST_WARE :str = str(os.getenv('POSTGRES_HOST_WARE'))
    POSTGRES_USER_APP :str = str(os.getenv('POSTGRES_USER_APP'))
    POSTGRES_USER_WARE :str = str(os.getenv('POSTGRES_USER_WARE'))
    POSTGRES_PASSWORD :str = str(os.getenv('POSTGRES_PASSWORD'))
    POSTGRES_DB_APP :str = str(os.getenv('POSTGRES_DB_APP'))
    POSTGRES_DB_WARE :str = str(os.getenv('POSTGRES_DB_WARE'))

cfg=Config()