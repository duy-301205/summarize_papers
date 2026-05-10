# xử lý Q&A
# Flow: query → embedding → retrieve → LLM → answer
import os
from google import genai
from app.db.postgres import SessionLocal
from app.db.models import ChatMessage
from app.vector_store.base_store import PGVectorStore
from app.models.embedding.e5_embedding import E5Embedder

class ChatService:
    def __init__(self):
        # Khởi tạo Client Gemini giống LLMService của bạn
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        self.model_name = 'gemini-2.5-flash' 
        
        # Khởi tạo công cụ tìm kiếm vector
        self.embedder = E5Embedder()
        self.vector_store = PGVectorStore(embeddings_model=self.embedder)

    def chat_with_paper(self, paper_id: int, conversation_id: int, user_query: str):
        """
        Hàm thực hiện luồng RAG để trả lời câu hỏi dựa trên paper_id cụ thể
        """
        # 1. Chuẩn bị query cho E5 (luôn cần prefix 'query: ')
        query_text = f"query: {user_query}"
        
        # 2. Tìm kiếm các đoạn văn bản liên quan nhất từ Database
        # Sử dụng hàm search_vectors bạn đã viết trong PGVectorStore
        relevant_chunks = self.vector_store.search_vectors(
            query=query_text,
            paper_id=paper_id,
            k=5  # Lấy 5 đoạn liên quan nhất
        )

        if not relevant_chunks:
            return "Xin lỗi, tôi không tìm thấy dữ liệu liên quan trong bài báo này."

        # 3. Xây dựng Context và Metadata từ kết quả trả về
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

        # 4. Xây dựng Prompt cho Gemini
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
            # 5. Gọi Gemini để tạo câu trả lời
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            answer = response.text

            # 6. Lưu vào Database (ChatMessage)
            self._save_chat_history(conversation_id, user_query, answer, sources)

            return {
                "answer": answer,
                "sources": sources
            }

        except Exception as e:
            print(f"Lỗi khi gọi Gemini RAG: {e}")
            return {"error": "Không thể xử lý câu hỏi lúc này."}

    def _save_chat_history(self, conversation_id, query, answer, sources):
        """Lưu lịch sử chat vào bảng chat_messages theo schema của bạn"""
        with SessionLocal() as db:
            # Lưu câu hỏi của User
            user_msg = ChatMessage(
                conversation_id=conversation_id,
                role="user",
                content=query
            )
            # Lưu câu trả lời của AI kèm nguồn (JSONB)
            ai_msg = ChatMessage(
                conversation_id=conversation_id,
                role="assistant",
                content=answer,
                source_nodes=sources 
            )
            db.add_all([user_msg, ai_msg])
            db.commit()