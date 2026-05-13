from app.db.postgres import SessionLocal
from app.db.models import Paper
from app.services.pdf_service import PDFService
from app.services.chunking_service import ChunkingService
from app.models.embedding.e5_embedding import E5Embedder
from app.vector_store.base_store import PGVectorStore

class EmbeddingService:
    def __init__(self):
        self.embedder = E5Embedder().get_model()
        self.vector_store = PGVectorStore(embeddings_model=self.embedder)
        self.chunking_service = ChunkingService()

    def embedding_workflow(self, paper_id: int):
        with SessionLocal() as db:
            paper = None
            try:
                # 1. Kiểm tra sự tồn tại của Paper
                paper = db.query(Paper).filter(Paper.id == paper_id).first()
                if not paper or not paper.file_path:
                    print(f"❌ Không tìm thấy Paper ID {paper_id}")
                    return False

                # 2. Bóc tách nội dung PDF (pages là List[Dict])
                print(f"📄 Đang bóc tách PDF theo trang: {paper.file_path}")
                pages = PDFService.extract_text(paper.file_path) 
                
                all_chunks_text = []
                all_metadatas = []
                global_index = 0

                # 3. Duyệt qua từng trang
                for page_data in pages:
                    # Truy cập nội dung và số trang từ dictionary
                    # Giả sử key là 'content' và 'page'
                    content = page_data.get("content", "")
                    page_num = page_data.get("page", 0)
                    
                    if not content or not content.strip():
                        continue
                    
                    # Chia nhỏ nội dung của trang hiện tại
                    page_chunks = self.chunking_service.chunk_article(content)
                    
                    for chunk_text in page_chunks:
                        all_chunks_text.append(chunk_text)
                        all_metadatas.append({
                            "chunk_index": global_index,
                            "page_number": page_num  # Dùng số trang thật từ parser
                        })
                        global_index += 1

                if not all_chunks_text:
                    raise ValueError("Không bóc tách được nội dung nào từ PDF.")

                # 4. Lưu Vector và Metadata
                print(f"🧬 Đang tạo Vector cho {len(all_chunks_text)} đoạn...")
                self.vector_store.save_vectors(
                    paper_id=paper_id,
                    all_chunks=all_chunks_text,
                    all_metadatas=all_metadatas,
                    batch_size=32
                )

                # 5. Cập nhật trạng thái (Dùng COMPLETED để khớp với Check Constraint của bạn)
                paper.status = "DONE" 
                db.commit()
                print(f"✅ Đã hoàn tất: {paper_id} với {global_index} chunks.")
                return True

            except Exception as e:
                db.rollback()
                if paper:
                    try:
                        paper.status = "FAILED"
                        db.commit()
                    except:
                        db.rollback()
                print(f"❌ Lỗi xử lý Embedding cho Paper {paper_id}: {str(e)}")
                raise e