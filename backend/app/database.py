from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import settings

# Enable SSL for cloud databases (e.g. Aiven).
# pymysql ignores ?ssl-mode in the URL — SSL must be passed via connect_args.
# We auto-detect cloud by checking if the host is not localhost/127.0.0.1.
_db_url = settings.DATABASE_URL
_is_cloud = "localhost" not in _db_url and "127.0.0.1" not in _db_url
_connect_args = {"ssl": {}} if _is_cloud else {}

engine = create_engine(
    _db_url,
    connect_args=_connect_args,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
