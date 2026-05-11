import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Khởi tạo client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def list_available_models():
    try:
        # Gọi lệnh lấy danh sách model từ server Groq
        models = client.models.list()
        
        print(f"{'MODEL ID':<30} | {'OWNED BY':<10} | {'ACTIVE'}")
        print("-" * 55)
        
        for model in models.data:
            # Lọc ra các model đang hoạt động
            status = "Yes" if model.active else "No"
            print(f"{model.id:<30} | {model.owned_by:<10} | {status}")
            
    except Exception as e:
        print(f"Lỗi khi lấy danh sách model: {e}")

if __name__ == "__main__":
    list_available_models()