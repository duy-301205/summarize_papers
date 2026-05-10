from sqlalchemy.orm import Session
from app.db.models import PaperChunk, AnalysisSession, Analysis
from app.services.llm_service import LLMService

class SummaryService:
    def __init__(self):
        self.llm = LLMService()

    def generate_summary(self, db: Session, paper_id: int, user_id: int):
        # 1. Tạo Session mới trong bảng analysis_sessions
        session = AnalysisSession(
            paper_id=paper_id,
            user_id=user_id,
            model_name="gemini-2.5-flash",
            prompt="Tóm tắt bài báo khoa học",
            status="RUNNING"
        )
        db.add(session)
        db.flush() # Để lấy được session.id ngay lập tức

        try:
            # 2. Lấy 69 chunks dữ liệu để gộp
            chunks = db.query(PaperChunk).filter(
                PaperChunk.paper_id == paper_id
            ).order_by(PaperChunk.chunk_index.asc()).all()
            
            full_text = "\n".join([c.content for c in chunks])

            # 3. Gọi AI tóm tắt
            summary_result = self.llm.summarize_text(full_text)

            # 4. Lưu vào bảng analysis
            new_analysis = Analysis(
                session_id=session.id,
                type="SUMMARY",
                content=summary_result,
                status="COMPLETED"
            )
            db.add(new_analysis)

            # 5. Cập nhật session thành công
            session.status = "COMPLETED"
            db.commit()
            return summary_result

        except Exception as e:
            db.rollback()
            session.status = "FAILED"
            db.commit()
            raise e