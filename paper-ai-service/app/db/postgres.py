# tạo connection DB

import os
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Lấy URL kết nối. Ví dụ: postgresql://user:pass@localhost:5432/dbname
# Lưu ý: Nếu chạy FastAPI trong Docker, POSTGRES_HOST phải là tên service của DB trong docker-compose
DATABASE_URL = f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@" \
               f"{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"

# Tạo Engine kết nối
# pool_size: Số lượng kết nối tối đa được giữ lại
# max_overflow: Số lượng kết nối có thể mở thêm vượt mức pool_size khi cần
engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True  
)

# Tạo SessionLocal để các repository gọi đến
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class để các Model trong models.py kế thừa
Base = declarative_base()

def get_db():
    """
    Dependency dùng trong FastAPI để quản lý vòng đời của Session.
    Nó đảm bảo mỗi request sẽ có 1 session riêng và tự động đóng sau khi xong.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """
    Hàm khởi tạo các extension cần thiết (như pgvector).
    Bạn có thể gọi hàm này khi startup FastAPI.
    """
    try:
        with engine.connect() as conn:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
            conn.commit()
            print("Successfully initialized pgvector extension.")
    except Exception as e:
        print(f"Error initializing database: {e}")