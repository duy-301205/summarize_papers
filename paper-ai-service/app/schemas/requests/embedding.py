from pydantic import BaseModel
from typing import Optional

class EmbeddingRequest(BaseModel):
    paper_id: int