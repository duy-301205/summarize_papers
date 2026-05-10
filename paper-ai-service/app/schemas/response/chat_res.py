from pydantic import BaseModel
from typing import List, Optional

class ChatResponse(BaseModel):
    answer: str
    sources: List[dict]