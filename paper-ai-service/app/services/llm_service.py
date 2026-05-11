import os
from groq import Groq
from dotenv import load_dotenv

# Load biến môi trường từ file .env
load_dotenv()

class LLMService:
    def __init__(self):
        # Khởi tạo Groq client với API Key từ .env
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        
        # Sử dụng model mới nhất từ danh sách bạn đã kiểm tra
        # llama-3.3-70b-versatile là lựa chọn tốt nhất cho tóm tắt học thuật
        self.model_name = os.getenv("GROQ_MAIN_MODEL", "llama-3.3-70b-versatile")

    def summarize_text(self, text: str) -> str:
        """
        Tóm tắt văn bản hoặc chunks.
        Giữ nguyên cấu trúc trả về là chuỗi (string) như bản Gemini cũ.
        """
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
            # Gọi API Groq thay vì Gemini
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "Bạn là một trợ lý AI chuyên nghiệp, phản hồi bằng tiếng Việt và tuân thủ định dạng yêu cầu."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model_name,
                temperature=0.2,  # Giữ độ ổn định cho văn phong học thuật
                max_tokens=4096   # Đảm bảo đủ độ dài cho bản tóm tắt chi tiết
            )
            
            # Trả về kết quả dạng text trực tiếp (tương ứng với response.text của Gemini SDK)
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Lỗi tóm tắt văn bản (Groq): {e}")
            return None