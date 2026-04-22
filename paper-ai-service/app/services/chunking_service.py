# chia text thành chunks
# app/services/chunking_service.py
from app.data.chunking.recursive_chunk import TextChunker
from typing import List

class ChunkingService:
    def __init__(self):
        # Khởi tạo công cụ chia Chunk
        self.chunker = TextChunker()
        
    def chunk_article(self, text_content: str) -> List[str]:
        """Nghiệp vụ băm văn bản: Nhận string sạch và trả về list các đoạn văn."""
        if not text_content:
            return []
            
        # Gọi "Máy băm" chúng ta copy từ build_vector_db.py
        chunks = self.chunker.split_text(text_content)
        
        # Thêm tiền tố 'passage: ' cho chuẩn model e5-base
        formatted_chunks = [f"passage: {chunk}" for chunk in chunks]
        return formatted_chunks