# đọc PDF
# extract text theo page
# app/services/pdf_service.py
from app.data.processed.parser import PDFParser
import os

class PDFService:
    @staticmethod
    def extract_text(file_path: str) -> str:
        """Nghiệp vụ đọc PDF: Kiểm tra file, gọi parser bóc tách lấy text."""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Không tìm thấy file: {file_path}")
            
        # Gọi "Công cụ bóc PDF" chúng ta đã copy từ vnu_pdf_cleaner.py
        raw_text = PDFParser.extract_text_2_columns(file_path)
        return raw_text