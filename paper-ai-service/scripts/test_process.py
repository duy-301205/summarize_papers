import os
import sys
from pathlib import Path


project_root = Path(__file__).resolve().parent.parent
sys.path.append(str(project_root))

from app.services.embedding_service import EmbeddingService


def run_test_search():
    paper_id = int(os.getenv("TEST_PAPER_ID", "1"))
    user_query = os.getenv("TEST_QUERY", "cam xuc tieu cuc cua hoc sinh")

    emb_service = EmbeddingService()
    results = emb_service.search_similar_chunks(user_query, paper_id=paper_id, top_k=3)

    if not results:
        print(f"No chunks found for paper_id={paper_id}.")
        return

    for idx, (chunk, score) in enumerate(results, start=1):
        print(f"\n--- Top {idx} (cosine distance: {score:.4f}) ---")
        print(f"paper_id={chunk.paper_id} | chunk_index={chunk.chunk_index}")
        print(chunk.content[:300] + "...")


if __name__ == "__main__":
    run_test_search()
