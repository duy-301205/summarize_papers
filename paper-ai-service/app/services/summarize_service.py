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
            model_name=self.llm.model_name,
            prompt="Tóm tắt bài báo khoa học",
            status="RUNNING"
        )

        db.add(session)
        db.commit()
        db.refresh(session)

        try:
            # 2. Lấy chunks dữ liệu
            chunks = db.query(PaperChunk).filter(
                PaperChunk.paper_id == paper_id
            ).order_by(PaperChunk.chunk_index.asc()).all()

            if not chunks:
                raise ValueError("Không tìm thấy chunk nào cho bài báo này.")

            # 3. Tóm tắt từng nhóm chunk để tránh vượt token limit
            partial_summaries = []

            batch_size = 25

            for i in range(0, len(chunks), batch_size):
                batch_chunks = chunks[i:i + batch_size]

                batch_text = "\n\n".join([
                    c.content for c in batch_chunks
                    if c.content and c.content.strip()
                ])

                if not batch_text.strip():
                    continue

                batch_summary = self.llm.summarize_text(batch_text)
                partial_summaries.append(batch_summary)

            if not partial_summaries:
                raise ValueError("Không tạo được bản tóm tắt thành phần.")

            # 4. Gộp các bản tóm tắt nhỏ và tóm tắt lần cuối
            combined_summary = "\n\n".join(partial_summaries)

            summary_result = self.llm.summarize_text(
                combined_summary,
                is_final=True
            )

            if not summary_result or not summary_result.strip():
                raise ValueError("Không tạo được bản tóm tắt cuối cùng.")

            # 5. Lưu vào bảng analysis
            new_analysis = Analysis(
                session_id=session.id,
                type="SUMMARY",
                content=summary_result,
                status="COMPLETED"
            )

            db.add(new_analysis)

            # 6. Cập nhật session thành công
            session.status = "COMPLETED"

            db.commit()

            return summary_result

        except Exception as e:
            db.rollback()

            failed_session = db.query(AnalysisSession).filter(
                AnalysisSession.id == session.id
            ).first()

            if failed_session:
                failed_session.status = "FAILED"
                db.commit()

            raise e