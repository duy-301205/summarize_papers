from fastapi import APIRouter, BackgroundTasks, Depends
from app.schemas.requests.paper import PaperProcessRequest
from app.schemas.response.paper import PaperProcessResponse
from app.services.extract_service import ExtractService

router = APIRouter()

@router.post("/process", response_model=PaperProcessResponse)
async def process_paper(
    payload: PaperProcessRequest, 
    background_tasks: BackgroundTasks
):
    
    background_tasks.add_task(ExtractService.extract_and_save_workflow, payload.paper_id)

    # Trả về kết quả ngay lập tức cho Client (Spring Boot)
    return PaperProcessResponse(
        message="Đã tiếp nhận yêu cầu xử lý bài báo.",
        paper_id=payload.paper_id,
        status="PROCESSING"
    )