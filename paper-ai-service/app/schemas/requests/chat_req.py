from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    paper_id: int
    conversation_id: Optional[int] = None # Có thể null nếu là chat mới
    message: str