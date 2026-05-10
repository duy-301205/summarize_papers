import json
import sys
from pathlib import Path

from tqdm import tqdm


paper_ai_root = Path(__file__).resolve().parent.parent
sys.path.append(str(paper_ai_root))

from app.data.chunking.recursive_chunk import TextChunker
from app.services.embedding_service import EmbeddingService


def _paper_id(article: dict) -> int:
    value = article.get("paper_id") or article.get("paperId") or article.get("id")
    if value is None:
        raise ValueError("Every article must include paper_id, paperId, or id that maps to papers.id")
    return int(value)


def ingest_all_data():
    project_root = paper_ai_root.parent
    json_path = project_root / "data" / "processed" / "vnu_articles_metadata_final.json"

    with open(json_path, "r", encoding="utf-8") as f:
        articles = json.load(f)

    valid_articles = [a for a in articles if a.get("content_cleaned")]
    chunker = TextChunker()
    emb_service = EmbeddingService()

    for article in tqdm(valid_articles, desc="Ingesting articles"):
        paper_id = _paper_id(article)
        chunks = chunker.split_text(article["content_cleaned"])
        all_chunks = [f"passage: {chunk}" for chunk in chunks]
        all_metadatas = [
            {
                "paper_id": paper_id,
                "source_file": f"article_{paper_id}",
                "title": article.get("title", ""),
                "chunk_index": i,
            }
            for i in range(len(chunks))
        ]

        emb_service.process_and_save_chunks(
            paper_id=paper_id,
            all_chunks=all_chunks,
            all_metadatas=all_metadatas,
        )

    print("Finished ingesting data into paper_chunks.")


if __name__ == "__main__":
    ingest_all_data()
