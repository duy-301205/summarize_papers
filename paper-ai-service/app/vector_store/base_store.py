from app.db.postgres import SessionLocal
from app.db.repository import upsert_paper_chunks 
from app.db.models import PaperChunk 
from sqlalchemy.orm import Session


class PGVectorStore:
    def __init__(self, embeddings_model):
        self.embeddings_model = embeddings_model

    @staticmethod
    def _stored_content(text: str) -> str:
        return text.removeprefix("passage: ").strip()

    def save_vectors(
        self,
        paper_id: int,
        all_chunks: list[str],
        all_metadatas: list[dict],
        batch_size: int = 100,
    ):
        if paper_id is None:
            raise ValueError("paper_id is required to save chunks into paper_chunks")
        if len(all_chunks) != len(all_metadatas):
            raise ValueError("all_chunks and all_metadatas must have the same length")

        with SessionLocal() as db:
            for start in range(0, len(all_chunks), batch_size):
                chunk_batch = all_chunks[start : start + batch_size]
                metadata_batch = all_metadatas[start : start + batch_size]
                embeddings = self.embeddings_model.embed_documents(chunk_batch)

                rows = []
                for text, metadata, embedding in zip(chunk_batch, metadata_batch, embeddings):
                    rows.append({
                        "paper_id": paper_id,
                        "content": self._stored_content(text),
                        "embedding": embedding,
                        "page_number": metadata.get("page_number", 0), 
                        "chunk_index": metadata.get("chunk_index", 0),
                    })
                upsert_paper_chunks(db, rows)

    def search_vectors(self, query: str, paper_id: int, k: int = 5):
        query_vector = self.embeddings_model.embed_query(query)
        
        with SessionLocal() as db:
            results = db.query(PaperChunk) \
                .filter(PaperChunk.paper_id == paper_id) \
                .order_by(PaperChunk.embedding.cosine_distance(query_vector)) \
                .limit(k) \
                .all()
            return results