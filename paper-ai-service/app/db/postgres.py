import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


load_dotenv()


def _env(name: str, default: str) -> str:
    return os.getenv(name, default).strip()


db_user = _env("POSTGRES_USER", "postgres")
db_pass = _env("POSTGRES_PASSWORD", "1111")
db_host = _env("POSTGRES_HOST", "postgres")
db_port = _env("POSTGRES_PORT", "5432")
db_name = _env("POSTGRES_DB", "summarize_db")

DATABASE_URL = _env(
    "DATABASE_URL",
    f"postgresql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}",
)

engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    try:
        with engine.connect() as conn:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
            conn.commit()
            print("Successfully initialized pgvector extension.")
    except Exception as e:
        print(f"Error initializing database: {e}")
