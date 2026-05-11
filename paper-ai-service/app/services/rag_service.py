import os
from groq import Groq
from app.db.postgres import SessionLocal
from app.db.models import ChatMessage
from app.vector_store.base_store import PGVectorStore
from app.models.embedding.e5_embedding import E5Embedder
from dotenv import load_dotenv

# Load biến môi trường
load_dotenv()

class ChatService:
    def __init__(self):
        # 1. Chuyển đổi sang Groq Client
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        
        # 2. Sử dụng model mạnh nhất để đảm bảo khả năng lập luận dựa trên context
        self.model_name = os.getenv("GROQ_MAIN_MODEL", "llama-3.3-70b-versatile")
        
        # Giữ nguyên các công cụ tìm kiếm vector cũ
        self.embedder = E5Embedder()
        self.vector_store = PGVectorStore(embeddings_model=self.embedder)

    def chat_with_paper(self, paper_id: int, conversation_id: int, user_query: str):
        """
        Hàm thực hiện luồng RAG đã được đồng bộ hóa với Groq API
        """
        # 1. Chuẩn bị query cho E5
        query_text = f"query: {user_query}"
        
        # 2. Tìm kiếm các đoạn văn bản liên quan nhất từ Database
        relevant_chunks = self.vector_store.search_vectors(
            query=query_text,
            paper_id=paper_id,
            k=5
        )

        if not relevant_chunks:
            return {"answer": "Xin lỗi, tôi không tìm thấy dữ liệu liên quan trong bài báo này.", "sources": []}

        # 3. Xây dựng Context và Metadata
        context_parts = []
        sources = []
        for doc in relevant_chunks:
            p_num = doc.page_number if doc.page_number is not None else 0
            c_idx = doc.chunk_index if doc.chunk_index is not None else 0
            
            context_parts.append(f"[Trang {p_num}]: {doc.content}")
            sources.append({
                "page_number": p_num,
                "chunk_index": c_idx
            })
        
        context_combined = "\n\n".join(context_parts)

        # 4. Xây dựng Prompt (Giữ nguyên logic Prompt của bạn)
        prompt = f"""
        Bạn là một chuyên gia hỗ trợ nghiên cứu. Hãy trả lời câu hỏi của người dùng dựa TRÊN NGỮ CẢNH được cung cấp từ bài báo khoa học.
        
        Yêu cầu:
        - Nếu thông tin không có trong ngữ cảnh, hãy trả lời: 'Tôi không tìm thấy thông tin này trong bài báo'.
        - Trình bày rõ ràng, khách quan, trích dẫn số trang nếu có thể.
        - Ngôn ngữ: Tiếng Việt.

        NGỮ CẢNH TRÍCH XUẤT:
        {context_combined}

        CÂU HỎI CỦA NGƯỜI DÙNG:
        {user_query}
        """

        try:
            # 5. Gọi Groq thay vì Gemini
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "Bạn là trợ lý nghiên cứu khoa học, trả lời dựa trên tài liệu được cung cấp."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model_name,
                temperature=0.1, # Thấp để AI không "chế" thêm thông tin ngoài tài liệu
                max_tokens=2048
            )
            
            answer = response.choices[0].message.content

            # 6. Lưu vào Database (Giữ nguyên logic cũ của bạn)
            self._save_chat_history(conversation_id, user_query, answer, sources)

            return {
                "answer": answer,
                "sources": sources
            }

        except Exception as e:
            print(f"Lỗi khi gọi Groq RAG: {e}")
            return {"error": "Không thể xử lý câu hỏi lúc này do lỗi hệ thống API."}

    def _save_chat_history(self, conversation_id, query, answer, sources):
        """Lưu lịch sử chat - Giữ nguyên không đổi"""
        with SessionLocal() as db:
            user_msg = ChatMessage(
                conversation_id=conversation_id,
                role="user",
                content=query
            )
            ai_msg = ChatMessage(
                conversation_id=conversation_id,
                role="assistant",
                content=answer,
                source_nodes=sources 
            )
            db.add_all([user_msg, ai_msg])
            db.commit()