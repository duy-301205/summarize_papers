import re
import os
import json
import fitz
from groq import Groq
from dotenv import load_dotenv

# Load biến môi trường từ file .env
load_dotenv()

# ============================================================================
# JOURNAL MAP - Giữ nguyên để logic xác định journal_code đồng nhất với bản cũ
# ============================================================================
VNU_JOURNAL_MAP = {
    "SSH": ["social sciences & humanities", "khoa học xã hội và nhân văn", "xa hoi va nhan van"],
    "ER": ["education research", "nghiên cứu giáo dục", "nghien cuu giao duc"],
    "EAB": ["economics and business", "kinh tế và kinh doanh", "kinh te", "kinh doanh"],
    "LS": ["legal studies", "luật học", "luat hoc"],
    "PaM": ["policy and management", "chính sách và quản lý", "quan ly"],
    "FS": ["foreign studies", "nghiên cứu nước ngoài", "nghien cuu nuoc ngoai"],
    "MPS": ["medical and pharmaceutical sciences", "y dược", "y duoc"],
    "JCSCE": ["computer science and communication engineering", "khoa học máy tính", "truyền thông"],
    "NST": ["natural sciences and technology", "khoa học tự nhiên và công nghệ"],
    "EES": ["earth and environmental sciences", "khoa học trái đất và môi trường"],
    "MAP": ["mathematics - physics", "toán học", "vật lý"],
    "AMD": ["advanced materials and devices", "vật liệu và linh kiện tiên tiến"]
}

class MetadataExtractor:
    # Khởi tạo Client Groq
    # Đảm bảo bạn đã đặt GROQ_API_KEY trong file .env
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    
    # Sử dụng Llama 3 70B để đảm bảo khả năng trích xuất JSON chuẩn xác nhất
    MODEL_NAME = os.getenv("GROQ_MAIN_MODEL", "llama-3.3-70b-versatile")

    @staticmethod
    def extract(pdf_path: str) -> dict:
        """
        Hàm extract giữ nguyên cấu trúc đầu ra (dict) để tương thích với các bước sau.
        """
        try:
            doc = fitz.open(pdf_path)
            
            # Lấy text 2 trang đầu (giữ nguyên logic cũ của bạn để tối ưu)
            full_text_pages = ""
            for i in range(min(2, len(doc))):
                full_text_pages += doc[i].get_text()
            doc.close()

            # Gọi AI thực hiện trích xuất toàn bộ trường thông tin
            ai_data = MetadataExtractor._call_ai_logic(full_text_pages)

            # Xác định Journal và Journal Code (Đảm bảo logic phân loại không đổi)
            journal_name = ai_data.get("journal", "N/A")
            journal_code = MetadataExtractor._determine_journal_code(journal_name)

            # CẤU TRÚC TRẢ VỀ: Giữ nguyên các key như bản Gemini cũ của bạn
            return {
                "title": ai_data.get("title"),
                "authors": ai_data.get("authors"),
                "publication_year": ai_data.get("publication_year"),
                "keywords": ai_data.get("keywords"),
                "doi": ai_data.get("doi"),
                "journal": journal_name,
                "journal_code": journal_code,
            }
            
        except Exception as e:
            print(f"Lỗi MetadataExtractor: {e}")
            # Trả về cấu trúc rỗng/mặc định để tránh lỗi NotNullViolation ở Database
            return {
                "title": None,
                "authors": None,
                "publication_year": None,
                "keywords": None,
                "doi": None,
                "journal": None,
                "journal_code": "OTHER",
            }

    @staticmethod
    def _call_ai_logic(raw_text: str) -> dict:
        """
        Thay thế hoàn toàn phần gọi Gemini bằng Groq.
        Dùng response_format để ép kết quả về JSON chuẩn.
        """
        # Lấy tối đa 5000 ký tự đầu như bản cũ của bạn
        context_text = raw_text[:5000]

        system_prompt = (
            "Bạn là trợ lý AI chuyên trích xuất metadata từ văn bản bài báo khoa học. "
            "Chỉ trích xuất thông tin bằng TIẾNG VIỆT (trừ DOI và tên riêng). "
            "Bạn phải trả về kết quả dưới định dạng JSON duy nhất."
        )

        user_prompt = f"""
        Nhiệm vụ: Trích xuất metadata từ văn bản sau.
        Yêu cầu trả về các key sau trong JSON:
        1. title: Tiêu đề bài báo (Tiếng Việt).
        2. authors: Tên các tác giả, cách nhau bằng dấu phẩy.
        3. publication_year: Năm xuất bản (kiểu số hoặc null).
        4. keywords: Các từ khóa tiếng Việt, cách nhau bằng dấu phẩy.
        5. doi: Mã định danh DOI.
        6. journal: Tên tạp chí đầy đủ.

        VĂN BẢN:
        {context_text}
        """

        try:
            response = MetadataExtractor.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                model=MetadataExtractor.MODEL_NAME,
                temperature=0.1,
                # Ép kiểu dữ liệu trả về là JSON để code sau không cần dùng Regex dọn dẹp
                response_format={"type": "json_object"}
            )
            
            result_text = response.choices[0].message.content
            return json.loads(result_text)
            
        except Exception as e:
            print(f"Lỗi gọi Groq API: {e}")
            return {}

    @staticmethod
    def _determine_journal_code(journal_name: str) -> str:
        """
        Logic xác định journal_code dựa trên tên tạp chí mà AI bóc được.
        Giữ nguyên logic khớp từ khóa để đảm bảo tính nhất quán với Database.
        """
        if not journal_name or journal_name == "N/A":
            return "OTHER"
            
        name_norm = journal_name.lower()
        
        for code, keywords in VNU_JOURNAL_MAP.items():
            for kw in keywords:
                if kw in name_norm:
                    return code
        
        return "OTHER"