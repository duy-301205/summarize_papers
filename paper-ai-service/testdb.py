from app.db.postgres import engine
from sqlalchemy import text

try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("✅ Kết nối Database thành công!")
except Exception as e:
    print(f"❌ Kết nối thất bại: {e}")