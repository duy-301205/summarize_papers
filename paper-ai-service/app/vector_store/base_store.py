from app.db.postgres import SessionLocal
from app.db.repository import search_relevant_chunks, upsert_paper_chunks


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
                    rows.append(
                        {
                            "paper_id": paper_id,
                            "content": self._stored_content(text),
                            "embedding": embedding,
                            "page_number": metadata.get("page_number"),
                            "chunk_index": metadata["chunk_index"],
                        }
                    )

                upsert_paper_chunks(db, rows)

    def search_vectors(self, query: str, paper_id: int, k: int = 3):
        if paper_id is None:
            raise ValueError("paper_id is required to search chunks from paper_chunks")

        query_vector = self.embeddings_model.embed_query(query)
        with SessionLocal() as db:
            return search_relevant_chunks(db, query_vector=query_vector, paper_id=paper_id, limit=k)
