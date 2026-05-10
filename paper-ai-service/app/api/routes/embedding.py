from fastapi import APIRouter, HTTPException, status
from app.services.embedding_service import EmbeddingService
from app.schemas.requests.embedding import EmbeddingRequest
from app.schemas.response.embedding import EmbeddingResponse

router = APIRouter()
embedding_service = EmbeddingService()

@router.post(
    "/process", 
    response_model=EmbeddingResponse, 
    status_code=status.HTTP_200_OK # Đổi từ 202 sang 200
)
async def trigger_embedding_process(request: EmbeddingRequest):
    """
    API xử lý Embedding đồng bộ. 
    Hệ thống sẽ chỉ trả về response khi đã lưu xong toàn bộ Vector vào DB.
    """
    try:
        # Gọi trực tiếp workflow và CHỜ (await) cho đến khi xong
        # Lưu ý: Vì workflow của bạn là hàm def bình thường, ta gọi trực tiếp
        success = embedding_service.embedding_workflow(request.paper_id)
        
        if not success:
            raise Exception("Workflow trả về thất bại.")

        return EmbeddingResponse(
            status="completed", # Đổi status thành completed
            message=f"Đã hoàn thành xử lý vector cho Paper {request.paper_id}",
            paper_id=request.paper_id
        )
        
    except Exception as e:
        print(f"❌ Error in Embedding Router: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Lỗi hệ thống: {str(e)}"
        )