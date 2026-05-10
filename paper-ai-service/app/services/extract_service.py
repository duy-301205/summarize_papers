# app/data/extract/extract_service.py

import fitz
from app.db.postgres import SessionLocal
from app.db.models import Paper
from app.data.extract.metadata_extractor import MetadataExtractor
from app.db.repository import upsert_paper_metadata

class ExtractService:

    @staticmethod
    def extract_and_save_workflow(paper_id: int):
        with SessionLocal() as db:
            paper = None
            try:
                # 1. Tìm Paper trong DB
                paper = (
                    db.query(Paper)
                    .filter(Paper.id == paper_id)
                    .first()
                )

                if not paper:
                    print(f"❌ Paper ID {paper_id} not found")
                    return None

                if not paper.file_path:
                    print(f"❌ Paper {paper_id} has no file path")
                    return None

                # 2. GỌI EXTRACTOR (Truyền đúng file_path theo yêu cầu của hàm extract của bạn)
                # Logic đọc file fitz.open() bây giờ nằm trọn vẹn trong MetadataExtractor
                metadata = MetadataExtractor.extract(paper.file_path)

                if not metadata or not metadata.get("title"):
                    paper.status = "FAILED"
                    db.commit()
                    print(f"❌ Metadata extraction failed for Paper ID {paper_id}")
                    return None

                # 3. CẬP NHẬT THÔNG TIN PAPER
                paper.title = metadata["title"][:255]
                paper.status = "PROCESSING"

                # 4. LƯU METADATA CHI TIẾT
                metadata_to_save = {
                    "paper_id": paper_id,
                    "authors": metadata.get("authors"),
                    "publication_year": metadata.get("publication_year"),
                    "keywords": metadata.get("keywords"),
                    "doi": metadata.get("doi"),
                    "journal": metadata.get("journal"),
                }

                upsert_paper_metadata(db, metadata_to_save)

                # 5. COMMIT
                db.commit()
                print(f"✅ Extract completed: {paper.title}")
                return metadata

            except Exception as e:
                db.rollback()
                if paper:
                    try:
                        paper.status = "FAILED"
                        db.commit()
                    except Exception:
                        db.rollback()
                
                print(f"❌ Extract failed for paper {paper_id}: {str(e)}")
                raise e