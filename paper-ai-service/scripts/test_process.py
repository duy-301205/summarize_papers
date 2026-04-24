# nạp dữ liệu hàng loạt từ file text/JSON đã cào sẵn.
import os
import sys
from pathlib import Path

# Thêm thư mục root (paper-ai-service) vào PYTHONPATH để import được 'app'
project_root = Path(__file__).resolve().parent.parent
sys.path.append(str(project_root))

from app.services.embedding_service import EmbeddingService

def run_test_search():
    print("="*50)
    print("🔍 TEST TÌM KIẾM BẰNG PGVECTOR (TRÊN POSTGRESQL)")
    print("="*50)
    
    print("🧠 Gọi Embedding Service để tải Model và kết nối DB...")
    emb_service = EmbeddingService()
    
    # Câu hỏi truy vấn tùy ý
    user_query = "cảm xúc tiêu cực của học sinh"
    print(f"\n🔎 Đang nhúng câu hỏi ra số và rà soát trong PGVector: '{user_query}'...")
    
    # Kết quả sẽ được EmbeddingService tự chèn prefix "query: "
    results = emb_service.search_similar_chunks(user_query, top_k=3)
    
    if not results:
        print("❌ Không tìm thấy hoặc Database đang trống rỗng!")
        return
        
    print("\n✨ 3 KẾT QUẢ TÌM KIẾM TỐT NHẤT LÀ:")
    for idx, (doc, score) in enumerate(results):
        print(f"\n--- Top {idx + 1} (Độ tương đồng / Khoảng cách L2: {score:.4f}) ---")
        print(f"📄 Nguồn: {doc.metadata.get('source_file')} | Chunk thứ: {doc.metadata.get('chunk_index')}")
        print(f"📝 Trích đoạn (thấy 300 kí tự đầu):\n{doc.page_content[:300]}...")
        print("-" * 50)

if __name__ == "__main__":
    run_test_search()
