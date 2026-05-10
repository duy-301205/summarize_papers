from sqlalchemy import BigInteger, CheckConstraint, Column, ForeignKey, Integer, String, Text, TIMESTAMP, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector

from .postgres import Base


class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True)
    username = Column(String(50), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    institution = Column(String(255))
    avatar_url = Column(String(500))
    role = Column(String(20), nullable=False, default="ROLE_USER")
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())


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

    __table_args__ = (
        CheckConstraint("status IN ('UPLOADED', 'PROCESSING', 'DONE', 'FAILED')", name="check_paper_status"),
    )


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"))
    paper_id = Column(BigInteger, ForeignKey("papers.id", ondelete="SET NULL"))
    created_at = Column(TIMESTAMP, server_default=func.now())


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(BigInteger, primary_key=True)
    conversation_id = Column(BigInteger, ForeignKey("conversations.id", ondelete="CASCADE"))
    role = Column(String(20), nullable=False)
    content = Column(Text)
    source_nodes = Column(JSONB)
    created_at = Column(TIMESTAMP, server_default=func.now())

    __table_args__ = (
        CheckConstraint("role IN ('user', 'assistant', 'system')", name="check_chat_message_role"),
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

    __table_args__ = (
        CheckConstraint("status IN ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED')", name="check_analysis_session_status"),
    )


class Analysis(Base):
    __tablename__ = "analysis"

    id = Column(BigInteger, primary_key=True)
    session_id = Column(BigInteger, ForeignKey("analysis_sessions.id", ondelete="CASCADE"))
    type = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    status = Column(String(20), default="PENDING")
    created_at = Column(TIMESTAMP, server_default=func.now())

    __table_args__ = (
        CheckConstraint("type IN ('SUMMARY', 'KEYWORDS', 'HIGHLIGHT')", name="check_analysis_type"),
        CheckConstraint("status IN ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED')", name="check_analysis_status"),
    )


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
        UniqueConstraint("paper_id", "chunk_index", name="uq_paper_chunk_index"),
        CheckConstraint("page_number >= 0", name="check_page_number_positive"),
        CheckConstraint("chunk_index >= 0", name="check_chunk_index_positive"),
    )


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"))
    message = Column(Text)
    type = Column(String(50))
    status = Column(String(20))
    created_at = Column(TIMESTAMP, server_default=func.now())

    __table_args__ = (
        CheckConstraint("type IN ('INFO', 'WARNING', 'ERROR')", name="check_notification_type"),
        CheckConstraint("status IN ('UNREAD', 'READ')", name="check_notification_status"),
    )
