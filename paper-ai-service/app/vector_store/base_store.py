# interface vector DB
from langchain_chroma import Chroma

class ChromaDBStore:
    def __init__(self, embeddings_model, db_dir: str):
        self.embeddings_model = embeddings_model
        self.db_dir = db_dir

    def save_vectors(self, all_chunks: list, all_metadatas: list, ids: list = None):
        # Tạo ID cố định nếu user không truyền vào, tránh bị trùng lặp sinh ra n bản sao khi chạy lại
        if not ids:
            ids = []
            for meta in all_metadatas:
                file_name = meta.get("source_file", "unknown")
                chunk_idx = meta.get("chunk_index", 0)
                # ID mẫu: SSH_0085.pdf_chunk_37
                ids.append(f"{file_name}_chunk_{chunk_idx}")

        # Lưu Chroma (có truyền ids vào)
        vector_db = Chroma.from_texts(
            texts=all_chunks,
            embedding=self.embeddings_model,
            metadatas=all_metadatas,
            ids=ids, # Nhét cơ chế đè (upsert) vào đây
            persist_directory=self.db_dir
        )
        return vector_db

    def search_vectors(self, query: str, k: int = 3):
        # Mở database Chroma đã lưu để tìm kiếm với thuật toán tương đồng (Similarity Search)
        vector_db = Chroma(
            persist_directory=self.db_dir,
            embedding_function=self.embeddings_model
        )
        # Sẽ trả về danh sách các kết hợp gồm (Đoạn văn - Document, Điểm tương đồng - Score)
        return vector_db.similarity_search_with_score(query, k=k)