# interface vector DB
from langchain_postgres import PGVector
from langchain_postgres.vectorstores import PGVector

class PGVectorStore:
    def __init__(self, embeddings_model, collection_name: str = "paper_chunks"):
        self.embeddings_model = embeddings_model
        self.collection_name = collection_name
        
        # Gắn cứng cấu hình kết nối DB cho team
        db_user = "postgres"
        db_pass = "1111"
        db_host = "localhost"
        db_port = "5432"
        db_name = "summarize_db"
        
        self.connection_string = f"postgresql+psycopg://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}"

    def save_vectors(self, all_chunks: list, all_metadatas: list, ids: list = None):
        # Tạo ID cố định nếu user không truyền vào, tránh bị trùng lặp
        if not ids:
            ids = []
            for meta in all_metadatas:
                file_name = meta.get("source_file", "unknown")
                chunk_idx = meta.get("chunk_index", 0)
                ids.append(f"{file_name}_chunk_{chunk_idx}")

        # Khởi tạo PGVector object
        vector_store = PGVector(
            embeddings=self.embeddings_model,
            collection_name=self.collection_name,
            connection=self.connection_string,
            use_jsonb=True,
        )
        
        # Lưu vào PostgreSQL (Tự động Upsert theo ID nếu đã tồn tại)
        vector_store.add_texts(texts=all_chunks, metadatas=all_metadatas, ids=ids)
        return vector_store

    def search_vectors(self, query: str, k: int = 3):
        # Mở database PostgreSQL đã lưu để tìm kiếm với thuật toán tương đồng
        vector_store = PGVector(
            embeddings=self.embeddings_model,
            collection_name=self.collection_name,
            connection=self.connection_string,
            use_jsonb=True,
        )
        # Trả về danh sách các kết hợp gồm (Đoạn văn - Document, Điểm tương đồng - Score)
        return vector_store.similarity_search_with_score(query, k=k)