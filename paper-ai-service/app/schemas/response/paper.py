from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PaperProcessResponse(BaseModel):
    message: str
    paper_id: int
    status: str

    class Config:
        from_attributes = True 