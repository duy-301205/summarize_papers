# Nhận câu hỏi user
# Gọi rag_service
from fastapi import APIRouter, HTTPException, Depends
from app.services.rag_service import ChatService
from app.schemas.requests.chat_req import ChatRequest
from app.schemas.response.chat_res import ChatResponse

router = APIRouter()

chat_service = ChatService()

@router.post("/ask", response_model=ChatResponse)
async def ask_paper(request: ChatRequest):
    try:
        
        result = chat_service.chat_with_paper(
            paper_id=request.paper_id,
            conversation_id=request.conversation_id,
            user_query=request.message
        )
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
            
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))