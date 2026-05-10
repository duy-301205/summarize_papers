from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from .models import Paper, PaperChunk, PaperMetadata


def upsert_paper_chunks(db: Session, chunks_data: list[dict]):
    if not chunks_data:
        return

    stmt = insert(PaperChunk).values(chunks_data)
    stmt = stmt.on_conflict_do_update(
        index_elements=["paper_id", "chunk_index"],
        set_={
            "content": stmt.excluded.content,
            "embedding": stmt.excluded.embedding,
            "page_number": stmt.excluded.page_number,
        },
    )
    db.execute(stmt)
    db.commit()


def save_paper_chunks(db: Session, chunks_data: list[dict]):
    upsert_paper_chunks(db, chunks_data)


def update_paper_title(
    db: Session,
    paper_id: int,
    title: str | None
):
    if paper_id is None:
        raise ValueError(
            "paper_id is required to update paper title"
        )

    if not title:
        return None

    paper = (
        db.query(Paper)
        .filter(Paper.id == paper_id)
        .first()
    )

    if not paper:
        return None

    paper.title = title.strip()[:255]

    # KHÔNG commit ở đây
    return paper


def upsert_paper_metadata(
    db: Session,
    metadata: dict
):
    if not metadata:
        return None

    paper_id = metadata.get("paper_id")

    if paper_id is None:
        raise ValueError(
            "paper_id is required to save paper metadata"
        )

    existing = (
        db.query(PaperMetadata)
        .filter(PaperMetadata.paper_id == paper_id)
        .first()
    )

    allowed_fields = (
        "authors",
        "publication_year",
        "keywords",
        "doi",
        "journal",
    )

    if existing:

        # chỉ update field có dữ liệu
        for field in allowed_fields:

            value = metadata.get(field)

            if value is not None:
                setattr(existing, field, value)

        return existing

    # create new metadata
    paper_metadata = PaperMetadata(
        paper_id=paper_id,
        **{
            field: metadata.get(field)
            for field in allowed_fields
        },
    )

    db.add(paper_metadata)

    return paper_metadata


def search_relevant_chunks(db: Session, query_vector: list[float], paper_id: int, limit: int = 5):
    distance = PaperChunk.embedding.cosine_distance(query_vector).label("distance")
    return (
        db.query(PaperChunk, distance)
        .filter(PaperChunk.paper_id == paper_id)
        .order_by(distance)
        .limit(limit)
        .all()
    )
