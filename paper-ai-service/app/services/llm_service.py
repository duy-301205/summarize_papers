# tóm tắt văn bản hoặc chunks
# Flow: chunks → LLM → summary

from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

class LLMService:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        self.model_name = 'gemini-2.5-flash'

    def summarize_text(self, text: str):
        prompt = f"""
        Bạn là một chuyên gia phân tích bài báo khoa học (Scientific Reviewer).
        Nhiệm vụ của bạn là tóm tắt nội dung bài báo dựa trên các mảnh văn bản được cung cấp.

        Hãy trình bày bản tóm tắt theo cấu trúc sau:
        - **Tổng quan**: Ngành nghiên cứu và chủ đề chính.
        - **Mục tiêu**: Vấn đề mà tác giả muốn giải quyết.
        - **Phương pháp**: Cách tiếp cận (Ví dụ: đối chiếu khối liệu, mô hình CARS...).
        - **Kết quả**: Các phát hiện quan trọng (Đặc biệt là sự khác biệt văn hóa giữa các ngôn ngữ).

        Yêu cầu: Ngôn ngữ Tiếng Việt, văn phong học thuật.
        
        Nội dung bài báo:
        {text}
        """
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            # Trả về response.text trực tiếp
            return response.text
        except Exception as e:
            print(f"Lỗi tóm tắt văn bản: {e}")
            return None