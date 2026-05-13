import os
import time
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

class LLMService:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.main_model = os.getenv("GROQ_MAIN_MODEL", "llama-3.3-70b-versatile")
        self.fast_model = os.getenv("GROQ_FAST_MODEL", "llama-3.1-8b-instant")

    def summarize_text(self, text: str, is_final: bool = False) -> str:
        if not text or not text.strip():
            raise ValueError("Nội dung đầu vào rỗng, không thể tóm tắt.")

        current_model = self.main_model if is_final else self.fast_model

        if is_final:
            task_instruction = """
            Nhiệm vụ của bạn là tổng hợp các bản tóm tắt thành phần thành một bản tóm tắt cuối cùng.
            Hãy tránh lặp ý, trình bày mạch lạc và có tính học thuật.
            """
            max_tokens = 1200
        else:
            task_instruction = """
            Nhiệm vụ của bạn là tóm tắt một phần nội dung của bài báo khoa học.
            Chỉ giữ lại các ý quan trọng, bỏ qua thông tin nhiễu như số trang, header, footer.
            """
            max_tokens = 700

        prompt = f"""
Bạn là một chuyên gia phân tích bài báo khoa học (Scientific Reviewer).

{task_instruction}

Hãy trình bày bản tóm tắt theo cấu trúc sau:
- **Tổng quan**: Lĩnh vực nghiên cứu và chủ đề chính của bài báo.
- **Mục tiêu**: Vấn đề nghiên cứu hoặc câu hỏi mà tác giả muốn giải quyết.
- **Phương pháp**: Phương pháp nghiên cứu, mô hình, dữ liệu hoặc cách tiếp cận được sử dụng.
- **Kết quả**: Các phát hiện, kết quả hoặc nhận định quan trọng của nghiên cứu.
- **Kết luận**: Ý nghĩa, đóng góp hoặc khuyến nghị chính của nghiên cứu.

Yêu cầu:
- Ngôn ngữ Tiếng Việt.
- Văn phong học thuật.
- Không tự bịa thông tin ngoài nội dung được cung cấp.

Nội dung:
{text}
"""

        last_error = None
        for attempt in range(3):
            try:
                response = self.client.chat.completions.create(
                    messages=[
                        {
                            "role": "system", 
                            "content": "Bạn là một trợ lý AI chuyên tóm tắt bài báo khoa học bằng tiếng Việt."
                        },
                        {
                            "role": "user", 
                            "content": prompt
                        }
                    ],
                    model=current_model,
                    temperature=0.2,
                    max_tokens=max_tokens
                )

                result = response.choices[0].message.content
                if not result or not result.strip():
                    raise ValueError("Groq trả về kết quả rỗng.")

                return result.strip()

            except Exception as e:
                last_error = e
                if "429" in str(e):
                    wait_time = 10
                    print(f"Lần {attempt + 1}: Chạm giới hạn Groq. Đang nghỉ {wait_time}s...")
                else:
                    wait_time = 5
                    print(f"Lỗi tóm tắt văn bản Groq lần {attempt + 1}: {e}")
                
                time.sleep(wait_time)

        raise RuntimeError(f"Tóm tắt thất bại sau 3 lần thử: {last_error}")