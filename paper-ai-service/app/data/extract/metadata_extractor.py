import os
import json
import fitz
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

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
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    MODEL_NAME = os.getenv("GROQ_MAIN_MODEL", "llama-3.3-70b-versatile")

    @staticmethod
    def extract(pdf_path: str) -> dict:
        try:
            full_text_pages = ""

            with fitz.open(pdf_path) as doc:
                for i in range(min(2, len(doc))):
                    full_text_pages += doc[i].get_text()

            ai_data = MetadataExtractor._call_ai_logic(full_text_pages)

            journal_name = ai_data.get("journal", "N/A")
            journal_code = MetadataExtractor._determine_journal_code(journal_name)

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
        context_text = raw_text[:5000]

        system_prompt = (
            "Bạn là trợ lý AI chuyên trích xuất metadata từ văn bản bài báo khoa học. "
            "Chỉ trích xuất thông tin bằng TIẾNG VIỆT (trừ DOI và tên riêng). "
            "Bạn phải trả về kết quả dưới định dạng JSON duy nhất."
        )

        user_prompt = f"""
        Nhiệm vụ: Trích xuất metadata từ văn bản sau.
        Yêu cầu trả về các key sau trong JSON:
        1. title: Tiêu đề bài báo.
        2. authors: Tên các tác giả, cách nhau bằng dấu phẩy.
        3. publication_year: Năm xuất bản, kiểu số hoặc null.
        4. keywords: Các từ khóa, cách nhau bằng dấu phẩy.
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
                response_format={"type": "json_object"}
            )

            result_text = response.choices[0].message.content
            return json.loads(result_text)

        except Exception as e:
            print(f"Lỗi gọi Groq API: {e}")
            return {}

    @staticmethod
    def _determine_journal_code(journal_name: str) -> str:
        if not journal_name or journal_name == "N/A":
            return "OTHER"

        name_norm = journal_name.lower()

        for code, keywords in VNU_JOURNAL_MAP.items():
            for kw in keywords:
                if kw in name_norm:
                    return code

        return "OTHER"