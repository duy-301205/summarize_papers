import os
from pathlib import Path

from app.services.chunking_service import ChunkingService
from app.services.embedding_service import EmbeddingService
from app.services.extract_service import ExtractService
from app.services.pdf_service import PDFService
from app.services.preprocessing_service import PreprocessingService


class PipelineService:
    def __init__(self):
        self.chunking_service = ChunkingService()
        self.embedding_service = EmbeddingService()

    def process_single_pdf(self, file_path: str, paper_id: int) -> bool:
        if paper_id is None:
            raise ValueError("paper_id is required. Create the papers row in Spring Boot before calling AI service.")
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        filename = Path(file_path).name
        print(f"Start processing paper_id={paper_id}, file={filename}")

        raw_text = PDFService.extract_text(file_path)
        if not raw_text:
            print(f"File is empty or unreadable: {filename}")
            return False

        metadata_text = f"{PDFService.extract_front_text(file_path)}\n\n{raw_text}".strip()
        metadata = ExtractService.extract_and_save_metadata(metadata_text, paper_id)
        print(f"Extracted metadata for paper_id={paper_id}: {metadata}")

        clean_text = PreprocessingService.clean_text(raw_text)
        if not clean_text or len(clean_text) < 100:
            print(f"File has too little text after cleaning: {filename}")
            return False

        chunks = self.chunking_service.chunk_article(clean_text)
        if not chunks:
            return False

        metadatas = [
            {
                "paper_id": paper_id,
                "source_file": filename,
                "chunk_index": i,
            }
            for i in range(len(chunks))
        ]

        self.embedding_service.process_and_save_chunks(
            paper_id=paper_id,
            all_chunks=chunks,
            all_metadatas=metadatas,
        )

        print(f"Finished processing paper_id={paper_id}, file={filename}")
        return True
