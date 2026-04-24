# Điều phối toàn bộ pipeline:
# PDF → parse → clean → chunk → embed → lưu DB
import os
from pathlib import Path

from app.services.pdf_service import PDFService
from app.services.preprocessing_service import PreprocessingService
from app.services.chunking_service import ChunkingService
from app.services.embedding_service import EmbeddingService

class PipelineService:
    def __init__(self):
        # Khởi tạo các service cần thiết (Bếp phó)
        self.chunking_service = ChunkingService()
        self.embedding_service = EmbeddingService()
        # PDFService và PreprocessingService dùng hàm tĩnh (@staticmethod) nên không cần khởi tạo

    def process_single_pdf(self, file_path: str) -> bool:
        """
        Nghiệp vụ chính của Bếp Trưởng: Điều phối xử lý 1 file PDF từ đầu tới cuối.
        Dành cho API gọi khi người dùng upload file lên trình duyệt web.
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"❌ Không tìm thấy file: {file_path}")

        filename = Path(file_path).name
        print(f"\n🔄 BẮT ĐẦU XỬ LÝ FILE: {filename}")

        # Bước 1: Gọi PDF Service (Đọc chữ thô)
        raw_text = PDFService.extract_text(file_path)
        if not raw_text:
            print(f"⚠️ CẢNH BÁO: File {filename} rỗng hoặc không đọc được.")
            return False

        # Bước 2: Gọi Preprocessing Service (Giặt rửa rác)
        clean_text = PreprocessingService.clean_text(raw_text)
        if not clean_text or len(clean_text) < 100:
            print(f"⚠️ CẢNH BÁO: File {filename} sau khi làm sạch rác thì hết chữ.")
            return False

        # Bước 3: Gọi Chunking Service (Băm nhỏ)
        chunks = self.chunking_service.chunk_article(clean_text)
        if not chunks:
            return False
            
        print(f"🔪 Đã chặt nhỏ được {len(chunks)} đoạn (chunks).")

        # Bước 4: Chuẩn bị Thẻ tên (Metadata) cho từng đoạn
        metadatas = []
        for i in range(len(chunks)):
            metadatas.append({
                "source_file": filename,  # Lưu tên file để sau trích xuất biết từ ông nào
                "chunk_index": i
            })

        # Bước 5: Gọi Embedding Service (Nhúng Vector và ném vào Kho PostgreSQL)
        print("🧠 Đang chuyển hóa thành Vector và lưu vào Database PostgreSQL...")
        self.embedding_service.process_and_save_chunks(chunks, metadatas)
        
        print(f"✅ HOÀN TẤT XỬ LÝ VÀ LƯU TRỮ FILE: {filename}\n")
        return True
