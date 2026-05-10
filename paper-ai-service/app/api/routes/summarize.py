# app/api/routes/summarize.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any

from app.db.postgres import get_db
from app.services.summarize_service import SummaryService

router = APIRouter()

# Khởi tạo service
summary_service = SummaryService()

@router.post("/summarize/{paper_id}", response_model=dict[str, Any])
def summarize_paper(
    paper_id: int, 
    user_id: int, 
    db: Session = Depends(get_db)
):
    """
    API Tóm tắt đồng bộ:
    1. Đợi lấy đủ chunks từ Postgres.
    2. Gửi request sang Gemini API.
    3. Lưu kết quả và trả về response cho Java.
    """
    try:
        # LOG để bạn dễ theo dõi trong terminal FastAPI
        print(f"🤖 Bắt đầu quy trình tóm tắt cho Paper ID: {paper_id} (User: {user_id})")
        
        summary_result = summary_service.generate_summary(db, paper_id, user_id)
        
        return {
            "status": "success",
            "message": f"Đã hoàn thành tóm tắt cho bài báo ID {paper_id}",
            "data": {
                "paper_id": paper_id,
                "summary": summary_result
            }
        }

    except ValueError as ve:
        # Lỗi logic: ví dụ ID bài báo không tồn tại hoặc chưa có chunks
        print(f"⚠️ Validation Error: {str(ve)}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=str(ve)
        )
    except Exception as e:
        # Lỗi hệ thống: Gemini lỗi, lỗi kết nối DB, v.v.
        print(f"❌ Summarization Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Lỗi hệ thống khi tóm tắt: {str(e)}"
        )