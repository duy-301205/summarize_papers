import re
import unicodedata
from typing import Any, Optional
import os
import json
from google import genai
from dotenv import load_dotenv
import fitz

# Load biến môi trường
load_dotenv()

# ============================================================================
# JOURNAL MAP (Dùng Global hoặc đưa vào Class)
# ============================================================================
VNU_JOURNAL_MAP: dict[str, list[str]] = {
    "SSH": ["social sciences & humanities", "xa hoi va nhan van"],
    "ER": ["education research", "nghien cuu giao duc"],
    "EAB": ["economics and business", "kinh te", "kinh doanh"],
    "LS": ["legal studies", "luat hoc"],
    "PaM": ["policy and management", "quan ly"],
    "FS": ["foreign studies", "nghien cuu nuoc ngoai"],
    "MPS": ["medical", "pharmaceutical", "y duoc"],
    "JCSCE": ["computer science", "communication engineering"],
    "NST": ["natural sciences and technology"],
    "EES": ["earth and environmental"],
    "MAP": ["mathematics", "physics"],
    "AMD": ["advanced materials"]
}

class MetadataExtractor:
    # Cấu hình AI giống như cách bạn làm ở LLMService
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    MODEL_NAME = "gemini-2.5-flash"

    @staticmethod
    def extract(pdf_path: str) -> dict[str, Any]:
        doc = fitz.open(pdf_path)
        
        # 1. Lấy text 2 trang đầu cho AI
        full_text_pages = ""
        for i in range(min(2, len(doc))):
            full_text_pages += doc[i].get_text()
            
        # 2. Thu thập blocks cho logic Journal/Year/DOI
        pages_data = [doc[i].get_text("dict") for i in range(min(4, len(doc)))]
        blocks = MetadataExtractor._collect_text_blocks(pages_data)
        doc.close()

        # 3. Trích xuất thông tin nhanh bằng Code
        journal, journal_code = MetadataExtractor._extract_journal(blocks)
        pub_year = MetadataExtractor._extract_year(full_text_pages, journal)
        doi = MetadataExtractor._extract_doi(full_text_pages)

        # 4. Trích xuất thông tin phức tạp bằng AI
        ai_data = MetadataExtractor._call_ai_logic(full_text_pages)

        return {
            "title": ai_data.get("title"),
            "authors": ai_data.get("authors"),
            "publication_year": pub_year,
            "keywords": ai_data.get("keywords"),
            "doi": doi,
            "journal": journal,
            "journal_code": journal_code,
        }

    @staticmethod
    def _call_ai_logic(raw_text: str) -> dict:
        prompt = f"""
        Nhiệm vụ: Trích xuất metadata bài báo khoa học từ văn bản thô.
        Yêu cầu:
        1. Chỉ lấy thông tin bằng TIẾNG VIỆT (Bỏ qua tiếng Anh).
        2. Trả về JSON với các key: title, authors, keywords.
        3. 'authors' chỉ lấy tên người, cách nhau bằng dấu phẩy.
        
        VĂN BẢN:
        {raw_text[:5000]}
        """
        try:
            # SDK MỚI: Gọi qua MetadataExtractor.client.models.generate_content
            response = MetadataExtractor.client.models.generate_content(
                model=MetadataExtractor.MODEL_NAME,
                contents=prompt
            )
            
            # Lấy text kết quả (SDK mới dùng thuộc tính .text trực tiếp)
            result_text = response.text
            
            # Dọn dẹp Markdown JSON nếu AI trả về (ví dụ: ```json ... ```)
            clean_json = re.sub(r'```json|```', '', result_text).strip()
            
            return json.loads(clean_json)
        except Exception as e:
            # In ra lỗi chi tiết để debug nếu cần
            print(f"Lỗi gọi AI (SDK mới): {e}")
            return {}

    # --- Các hàm Helper (Sửa lỗi NameError bằng cách dùng Global Map) ---

    @staticmethod
    def _extract_journal(blocks):
        candidates = []
        for block in blocks:
            text = block["text"].strip()
            norm = MetadataExtractor._normalize(text)
            if block["y"] > 120 or len(text) > 250: continue
            
            score = 0
            matched_code = None
            if re.search(r"tap chi.*dhqghn", norm): score += 120
            
            # Truy cập biến Global map
            for code, keywords in VNU_JOURNAL_MAP.items():
                if any(kw in norm for kw in keywords):
                    matched_code = code
                    score += 100
            
            if score >= 40: candidates.append((score, text, matched_code))
        
        if not candidates: return None, None
        candidates.sort(key=lambda x: x[0], reverse=True)
        return candidates[0][1], candidates[0][2]

    @staticmethod
    def _collect_text_blocks(pages_data):
        blocks = []
        for page_index, page in enumerate(pages_data):
            for block in page.get("blocks", []):
                if "lines" not in block: continue
                lines = []
                font_sizes = []
                bold_count = span_count = 0
                for line in block["lines"]:
                    line_text = ""
                    for span in line["spans"]:
                        text = MetadataExtractor._fix_encoding(span.get("text", "")).strip()
                        if not text: continue
                        line_text += text + " "
                        font_sizes.append(span.get("size", 0))
                        font_name = span.get("font", "").lower()
                        if "bold" in font_name or "black" in font_name: bold_count += 1
                        span_count += 1
                    line_text = line_text.strip()
                    if line_text: lines.append(line_text)
                if not lines: continue
                text = re.sub(r"\s+", " ", " ".join(lines)).strip()
                if len(text) < 3: continue
                bbox = block.get("bbox", [0, 0, 0, 0])
                blocks.append({
                    "text": text, "page": page_index,
                    "font_size": sum(font_sizes) / max(len(font_sizes), 1),
                    "is_bold": (bold_count / max(span_count, 1)) > 0.5,
                    "bbox": bbox, "x": bbox[0], "y": bbox[1],
                })
        blocks.sort(key=lambda b: (b["page"], round(b["y"], 1), b["x"]))
        return blocks

    @staticmethod
    def _extract_year(text, journal_line=None):
        years = [int(y) for y in re.findall(r"\b(19\d{2}|20\d{2})\b", text)]
        years = [y for y in years if 1990 <= y <= 2035]
        if journal_line:
            m = re.search(r"\((19|20)\d{2}\)", journal_line)
            if m: return int(re.search(r"\d{4}", m.group()).group())
        return min(years, key=lambda y: abs(y - 2025)) if years else None

    @staticmethod
    def _extract_doi(text):
        m = re.search(r"\b(10\.\d{4,9}/[-._;()/:A-Z0-9]+)", text, re.IGNORECASE)
        return m.group(1).rstrip(".,;)") if m else None

    @staticmethod
    def _normalize(text):
        text = unicodedata.normalize("NFD", text)
        return "".join(c for c in text if unicodedata.category(c) != "Mn").lower()

    @staticmethod
    def _fix_encoding(text):
        _VPS_ENCODING_MAP = {"µ": "à", "¸": "ề", "½": "ổ", "»": "ổ", "¨": "è", "©": "é", "ª": "ê"}
        for bad, good in _VPS_ENCODING_MAP.items():
            text = text.replace(bad, good)
        return re.sub(r"[\x00-\x1f\x7f]", "", text)