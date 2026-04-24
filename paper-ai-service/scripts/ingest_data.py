import json
import sys
from pathlib import Path
from tqdm import tqdm

# Thêm thư mục root (paper-ai-service) vào PYTHONPATH để import được 'app'
paper_ai_root = Path(__file__).resolve().parent.parent
sys.path.append(str(paper_ai_root))

# Import xử lý
from app.data.chunking.recursive_chunk import TextChunker
from app.services.embedding_service import EmbeddingService

def ingest_all_data():
    project_root = Path(__file__).resolve().parent.parent.parent
    paper_ai_root = Path(__file__).resolve().parent.parent
    
    json_path = project_root / "data" / "processed" / "vnu_articles_metadata_final.json"
    db_dir = str(paper_ai_root / "storage" / "vector_db")
    
    with open(json_path, 'r', encoding='utf-8') as f:
        articles = json.load(f)
        
    valid_articles = [a for a in articles if a.get('content_cleaned')]
    
    # 1. Gọi máy cắt chữ
    chunker = TextChunker()
    all_chunks = []
    all_metadatas = []
    
    print("Đang băm văn bản...")
    for art in tqdm(valid_articles):
        chunks = chunker.split_text(art['content_cleaned'])
        for i, chunk_text in enumerate(chunks):
            all_chunks.append(f"passage: {chunk_text}")
            all_metadatas.append({
                "source_file": f"article_{art.get('id', 'unknown')}", # Đã sửa thành source_file để PGVector tự động gán ID chống trùng
                "title": art.get('title', ''),
                "chunk_index": i
            })
            
    # 2 & 3. Gọi Service nhúng để lưu thẳng vào PostgreSQL
    print("Đang tải model Embedding và đổ vào PGVector...")
    emb_service = EmbeddingService()
    emb_service.process_and_save_chunks(all_chunks, all_metadatas)
    
    print("HOÀN TẤT NẠP DỮ LIỆU VÀO WEB!")

if __name__ == "__main__":
    ingest_all_data()