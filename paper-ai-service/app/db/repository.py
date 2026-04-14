# thao tác DB (CRUD)

from sqlalchemy.orm import Session
from .models import PaperChunk

def save_paper_chunks(db: Session, chunks_data: list):
    """Lưu danh sách các đoạn text và vector vào DB"""
    for data in chunks_data:
        db_chunk = PaperChunk(**data)
        db.add(db_chunk)
    db.commit()

def search_relevant_chunks(db: Session, query_vector: list, paper_id: int, limit: int = 5):
    """Tìm kiếm các đoạn văn liên quan nhất bằng cosine similarity"""
    return db.query(PaperChunk).filter(PaperChunk.paper_id == paper_id)\
        .order_by(PaperChunk.embedding.cosine_distance(query_vector))\
        .limit(limit).all()