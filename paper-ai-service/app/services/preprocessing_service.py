# làm sạch text
# app/services/preprocessing_service.py
from app.data.processed.cleaner import TextCleaner

class PreprocessingService:
    @staticmethod
    def clean_text(raw_text: str) -> str:
        """Nghiệp vụ làm sạch: Loại bỏ rác, header, footer của VNU."""
        if not raw_text:
            return ""
            
        # Gọi "Công cụ làm sạch" chúng ta đã copy từ vnu_pdf_cleaner.py
        cleaned_text = TextCleaner.clean_vnu_text(raw_text)
        return cleaned_text