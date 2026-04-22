import os
import sys
from pathlib import Path

# Thêm thư mục root (paper-ai-service) vào PYTHONPATH để import được 'app'
project_root = Path(__file__).resolve().parent.parent
sys.path.append(str(project_root))

from app.models.embedding.e5_embedding import E5Embedder
from app.vector_store.base_store import ChromaDBStore

def run_test_search():
    print("="*50)
    print("🔍 TEST TÌM KIẾM VECTOR (RETRIEVAL)")
    print("="*50)
    
    project_root = Path(__file__).resolve().parent.parent
    db_dir = str(project_root / "storage" / "vector_db")
    
    print("🧠 Đang load model nhúng...")
    e5_model = E5Embedder().get_model()
    
    # 1. Khởi tạo kết nối vào DB cũ
    db_store = ChromaDBStore(embeddings_model=e5_model, db_dir=db_dir)
    
    # 2. Câu hỏi truy vấn tùy ý bạn thay đổi
    user_query = "cảm xúc tiêu cực của học sinh"
    
    # Với mô hình multilungual-e5-base ta bắt buộc gán thêm chữ "query: " vào đầu câu hỏi
    formatted_query = f"query: {user_query}"
    
    print(f"\n🔎 Đang nhúng câu hỏi ra số và rà soát trong ChromaDB: '{user_query}'...")
    
    # Kéo 3 đoạn kết quả sát nhất
    results = db_store.search_vectors(formatted_query, k=3)
    
    if not results:
        print("❌ Không tìm thấy kết quả nào!")
        return
        
    print("\n✨ 3 KẾT QUẢ TÌM KIẾM TỐT NHẤT LÀ:")
    for idx, (doc, score) in enumerate(results):
        print(f"\n--- Top {idx + 1} (Độ tương đồng / Khoảng cách L2: {score:.4f}) ---")
        print(f"📄 Nguồn: {doc.metadata.get('source_file')} | Chunk thứ: {doc.metadata.get('chunk_index')}")
        print(f"📝 Trích đoạn (thấy 300 kí tự đầu):\n{doc.page_content[:300]}...")
        print("-" * 50)

if __name__ == "__main__":
    run_test_search()
