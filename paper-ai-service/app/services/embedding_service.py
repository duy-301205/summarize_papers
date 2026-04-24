# convert chunk → vector và điều phối việc nhúng dữ liệu vào embedding
from app.models.embedding.e5_embedding import E5Embedder
from app.vector_store.base_store import PGVectorStore

class EmbeddingService:
    def __init__(self):
        # 1. Khởi tạo cỗ máy nhúng (Model E5)
        self.embedder = E5Embedder().get_model()
        # 2. Khởi tạo kho lưu trữ (PostgreSQL với pgvector)
        self.vector_store = PGVectorStore(embeddings_model=self.embedder)

    def process_and_save_chunks(self, all_chunks: list, all_metadatas: list, batch_size: int = 100):
        """
        Nhúng và lưu vào cơ sở dữ liệu.
        Chia theo batch để không làm tràn RAM/làm Server quá tải.
        """
        print(f"Bắt đầu lưu {len(all_chunks)} chunks vào PostgreSQL (PGVector)...")
        
        # Nếu tương lai cần nhúng batch by batch thì chia nhỏ bằng vòng lặp ở đây.
        # Ở ví dụ này ta cũng có thể ném mọt cục cho driver của SQLAlchemy tự lo.
        # (Để đơn giản ta đẩy thẳng vô hàm save_vectors đã có sẵn cơ chế ID chống trùng lặp)
        
        self.vector_store.save_vectors(all_chunks=all_chunks, all_metadatas=all_metadatas)
        print("Đã lưu xong vào PGVector!")

    def search_similar_chunks(self, query: str, top_k: int = 3):
        """
        Tìm kiếm các đoạn văn bản tương đồng với câu hỏi.
        """
        # Với E5, luôn nhớ gán chữ "query: " vào trước câu hỏi
        formatted_query = f"query: {query}"
        results = self.vector_store.search_vectors(formatted_query, k=top_k)
        return results