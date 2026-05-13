# app/data/extract/extract_service.py

import os
import tempfile
import requests

from app.db.postgres import SessionLocal
from app.db.models import Paper
from app.data.extract.metadata_extractor import MetadataExtractor
from app.db.repository import upsert_paper_metadata


class ExtractService:

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

    @staticmethod
    def extract_and_save_workflow(paper_id: int):
        temp_path = None

        with SessionLocal() as db:
            paper = None

            try:
                paper = (
                    db.query(Paper)
                    .filter(Paper.id == paper_id)
                    .first()
                )

                if not paper:
                    print(f"❌ Paper ID {paper_id} not found")
                    return None

                if not paper.file_url:
                    print(f"❌ Paper {paper_id} has no file url")
                    paper.status = "FAILED"
                    db.commit()
                    return None

                temp_path = ExtractService._download_pdf_to_temp(paper.file_url)

                metadata = MetadataExtractor.extract(temp_path)

                if not metadata or not metadata.get("title"):
                    paper.status = "FAILED"
                    db.commit()
                    print(f"❌ Metadata extraction failed for Paper ID {paper_id}")
                    return None

                paper.title = metadata["title"][:255]
                paper.status = "PROCESSING"

                metadata_to_save = {
                    "paper_id": paper_id,
                    "authors": metadata.get("authors"),
                    "publication_year": metadata.get("publication_year"),
                    "keywords": metadata.get("keywords"),
                    "doi": metadata.get("doi"),
                    "journal": metadata.get("journal"),
                }

                upsert_paper_metadata(db, metadata_to_save)

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

            finally:
                if temp_path and os.path.exists(temp_path):
                    try:
                        os.remove(temp_path)
                    except Exception as cleanup_error:
                        print(f"⚠️ Cannot remove temp PDF file: {cleanup_error}")