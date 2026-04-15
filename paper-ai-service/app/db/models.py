from sqlalchemy import Column, Integer, String, BigInteger, Text, ForeignKey, TIMESTAMP, CheckConstraint, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
from .postgres import Base

class Paper(Base):
    __tablename__ = "papers"

    id = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String(255))
    file_path = Column(String(500))
    file_size = Column(BigInteger)
    file_type = Column(String(20))
    status = Column(String(20), default="UPLOADED")
    checksum = Column(String(255))
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class PaperMetadata(Base):
    __tablename__ = "paper_metadata"

    id = Column(BigInteger, primary_key=True)
    paper_id = Column(BigInteger, ForeignKey("papers.id", ondelete="CASCADE"))
    authors = Column(Text)
    publication_year = Column(Integer)
    keywords = Column(Text)
    doi = Column(String(100))
    journal = Column(String(255))
    created_at = Column(TIMESTAMP, server_default=func.now())

class PaperChunk(Base):
    __tablename__ = "paper_chunks"

    id = Column(BigInteger, primary_key=True)
    paper_id = Column(BigInteger, ForeignKey("papers.id", ondelete="CASCADE"))
    content = Column(Text, nullable=False)
    embedding = Column(Vector(768), nullable=False)
    page_number = Column(Integer)
    chunk_index = Column(Integer, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    __table_args__ = (
        UniqueConstraint('paper_id', 'chunk_index', name='uq_paper_chunk_index'),
        CheckConstraint('page_number >= 0', name='check_page_number_positive'),
    )

class AnalysisSession(Base):
    __tablename__ = "analysis_sessions"

    id = Column(BigInteger, primary_key=True)
    paper_id = Column(BigInteger, ForeignKey("papers.id", ondelete="CASCADE"))
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"))
    prompt = Column(Text)
    model_name = Column(String(100))
    status = Column(String(20), default="PENDING")
    created_at = Column(TIMESTAMP, server_default=func.now())

class Analysis(Base):
    __tablename__ = "analysis"

    id = Column(BigInteger, primary_key=True)
    session_id = Column(BigInteger, ForeignKey("analysis_sessions.id", ondelete="CASCADE"))
    type = Column(String(50), nullable=False) # SUMMARY, KEYWORDS, HIGHLIGHT
    content = Column(Text, nullable=False)
    status = Column(String(20), default="PENDING")
    created_at = Column(TIMESTAMP, server_default=func.now())

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(BigInteger, primary_key=True)
    conversation_id = Column(BigInteger, ForeignKey("conversations.id", ondelete="CASCADE"))
    role = Column(String(20), nullable=False) # user, assistant, system
    content = Column(Text)
    source_nodes = Column(JSONB) # Lưu vết các chunks đã dùng để trả lời
    created_at = Column(TIMESTAMP, server_default=func.now())