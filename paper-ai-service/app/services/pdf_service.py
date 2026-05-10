# đọc PDF
# extract text theo page
# app/services/pdf_service.py
import os

import fitz

from app.data.processed.parser import PDFParser

class PDFService:
    @staticmethod
    def extract_text(file_path: str) -> str:
        """Nghiệp vụ đọc PDF: Kiểm tra file, gọi parser bóc tách lấy text."""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Không tìm thấy file: {file_path}")
            
        # Bạn cần sửa lại PDFParser.extract_text_2_columns 
        # để nó trả về List[str] (mỗi phần tử là 1 trang) thay vì join("\n")
        pages_content = PDFParser.extract_text_2_columns(file_path) 
        
        result = []
        for i, content in enumerate(pages_content):
            result.append({
                "content": content,
                "page": i + 1  # Số trang thực tế
            })
        return result

    @staticmethod
    def extract_front_text(file_path: str, max_pages: int = 2) -> str:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        pages_text = []
        with fitz.open(file_path) as doc:
            for page in doc[: min(max_pages, len(doc))]:
                pages_text.append(page.get_text("text"))

        return "\n".join(pages_text).strip()
