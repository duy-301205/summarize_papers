# tạo connection DB

from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Gắn cứng cấu hình kết nối DB cho team
db_user = "postgres"
db_pass = "1111"
db_host = "localhost"
db_port = "5432"
db_name = "summarize_db"

DATABASE_URL = f"postgresql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}"

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