# yêu cầu extract
from pydantic import BaseModel
from typing import List, Optional

class VNUArticleSchema(BaseModel):
    """
    Schema tương đương với VNUArticle của bạn bên ngoài.
    Dùng để quy chuẩn dữ liệu khi Backend xử lý.
    """
    id: str
    title: str
    authors: List[str]
    year: int
    abstract: str
    
    # Các trường mở rộng (có thể không có sẵn ngay lúc upload)
    journal: Optional[str] = None
    pdf_url: Optional[str] = None
    pdf_path: Optional[str] = None
    url: Optional[str] = None
    scraped_date: Optional[str] = None
    language: str = "vi"
    download_status: str = "pending"
    
    # Thêm các trường của file sau khi đã xử lý (để API xử lý tiếp)
    content_cleaned: Optional[str] = None
    extraction_status: str = "pending"