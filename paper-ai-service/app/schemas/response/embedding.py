from pydantic import BaseModel
from typing import Optional

class EmbeddingResponse(BaseModel):
    status: str
    message: str
    paper_id: int
    task_type: Optional[str] = "embedding"