import os
import tempfile
import requests

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

    @staticmethod
    def _download_pdf_to_temp(file_url: str) -> str:
        if not file_url:
            raise ValueError("file_url is empty")

        response = requests.get(file_url, timeout=60)
        response.raise_for_status()

        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")

        try:
            temp_file.write(response.content)
            temp_file.flush()
            return temp_file.name
        finally:
            temp_file.close()

    def embedding_workflow(self, paper_id: int):
        temp_path = None

        with SessionLocal() as db:
            paper = None

            try:
                paper = db.query(Paper).filter(Paper.id == paper_id).first()

                if not paper:
                    print(f"❌ Không tìm thấy Paper ID {paper_id}")
                    return False

                if not paper.file_url:
                    print(f"❌ Paper ID {paper_id} không có file_url")
                    paper.status = "FAILED"
                    db.commit()
                    return False

                temp_path = self._download_pdf_to_temp(paper.file_url)

                print(f"📄 Đang bóc tách PDF từ Cloudinary: {paper.file_url}")
                pages = PDFService.extract_text(temp_path)

                all_chunks_text = []
                all_metadatas = []
                global_index = 0

                for page_data in pages:
                    content = page_data.get("content", "")
                    page_num = page_data.get("page", 0)

                    if not content or not content.strip():
                        continue

                    page_chunks = self.chunking_service.chunk_article(content)

                    for chunk_text in page_chunks:
                        all_chunks_text.append(chunk_text)
                        all_metadatas.append({
                            "chunk_index": global_index,
                            "page_number": page_num
                        })
                        global_index += 1

                if not all_chunks_text:
                    raise ValueError("Không bóc tách được nội dung nào từ PDF.")

                print(f"🧬 Đang tạo Vector cho {len(all_chunks_text)} đoạn...")
                self.vector_store.save_vectors(
                    paper_id=paper_id,
                    all_chunks=all_chunks_text,
                    all_metadatas=all_metadatas,
                    batch_size=32
                )

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
                    except Exception:
                        db.rollback()

                print(f"❌ Lỗi xử lý Embedding cho Paper {paper_id}: {str(e)}")
                raise e

            finally:
                if temp_path and os.path.exists(temp_path):
                    try:
                        os.remove(temp_path)
                    except Exception as cleanup_error:
                        print(f"⚠️ Không thể xóa file PDF tạm: {cleanup_error}")