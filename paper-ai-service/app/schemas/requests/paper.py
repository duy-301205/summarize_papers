from pydantic import BaseModel

# Dữ liệu Spring Boot gửi sang
class PaperProcessRequest(BaseModel):
    paper_id: int


