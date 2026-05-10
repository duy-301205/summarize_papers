import hashlib
import json
import os
import sys
import random
from pathlib import Path


project_root = Path(__file__).resolve().parent.parent
sys.path.append(str(project_root))

from app.db.models import Paper, PaperChunk, User
from app.db.postgres import SessionLocal, init_db
from app.services.pipeline_service import PipelineService


def _file_checksum(path: Path) -> str:
    digest = hashlib.sha256()
    with open(path, "rb") as f:
        for block in iter(lambda: f.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def _get_or_create_test_user(db) -> User:
    username = os.getenv("TEST_USERNAME", "ai_test_user")
    user = db.query(User).filter(User.username == username).first()
    if user:
        return user

    user = User(
        username=username,
        password=os.getenv("TEST_PASSWORD", "test_password"),
        email=os.getenv("TEST_EMAIL", "ai_test_user@example.com"),
        role="ROLE_USER",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def _create_paper_for_pdf(db, user_id: int, pdf_path: Path) -> Paper:
    paper = Paper(
        user_id=user_id,
        title=pdf_path.stem,
        file_path=str(pdf_path),
        file_size=pdf_path.stat().st_size,
        file_type="pdf",
        status="PROCESSING",
        checksum=_file_checksum(pdf_path),
    )
    db.add(paper)
    db.commit()
    db.refresh(paper)
    return paper


def _update_paper_status(db, paper_id: int, status: str):
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if paper:
        paper.status = status
        db.commit()


def _write_debug_json(db, paper_id: int, pdf_path: Path, status: str):
    output_dir = project_root / "storage" / "processd_json"
    output_dir.mkdir(parents=True, exist_ok=True)

    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    chunks = (
        db.query(PaperChunk)
        .filter(PaperChunk.paper_id == paper_id)
        .order_by(PaperChunk.chunk_index)
        .all()
    )

    data = {
        "paper": {
            "id": paper.id if paper else paper_id,
            "title": paper.title if paper else pdf_path.stem,
            "file_path": paper.file_path if paper else str(pdf_path),
            "file_size": paper.file_size if paper else pdf_path.stat().st_size,
            "file_type": paper.file_type if paper else "pdf",
            "status": status,
            "checksum": paper.checksum if paper else _file_checksum(pdf_path),
        },
        "chunk_count": len(chunks),
        "chunks": [
            {
                "id": chunk.id,
                "paper_id": chunk.paper_id,
                "chunk_index": chunk.chunk_index,
                "page_number": chunk.page_number,
                "content": chunk.content,
                "embedding_dim": len(chunk.embedding) if chunk.embedding is not None else 0,
            }
            for chunk in chunks
        ],
    }

    output_path = output_dir / f"paper_{paper_id}_{pdf_path.stem}_debug.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Wrote debug JSON: {output_path}")


def run_test_pdf_upload():
    init_db()

    pdf_dir = project_root / "storage" / "raw_pdfs"
    pdf_files = list(pdf_dir.glob("*.pdf")) if pdf_dir.exists() else []
    if not pdf_files:
        print(f"Put test PDFs in {pdf_dir}")
        return

    selected_pdf = _select_pdf(pdf_dir, pdf_files)
    print(f"Selected PDF: {selected_pdf.name}")

    pipeline = PipelineService()

    with SessionLocal() as db:
        user = _get_or_create_test_user(db)

        paper = _create_paper_for_pdf(db, user_id=user.id, pdf_path=selected_pdf)
        print(f"Created papers.id={paper.id} for {selected_pdf.name}")

        try:
            ok = pipeline.process_single_pdf(str(selected_pdf), paper_id=paper.id)
            status = "DONE" if ok else "FAILED"
            _update_paper_status(db, paper.id, status)
            _write_debug_json(db, paper.id, selected_pdf, status)
            print(f"paper_id={paper.id} status={status}")
        except Exception:
            _update_paper_status(db, paper.id, "FAILED")
            _write_debug_json(db, paper.id, selected_pdf, "FAILED")
            raise


def _select_pdf(pdf_dir: Path, pdf_files: list[Path]) -> Path:
    arg_pdf = sys.argv[1] if len(sys.argv) > 1 else None
    requested = arg_pdf or os.getenv("TEST_PDF")

    if requested:
        requested_path = Path(requested)
        if not requested_path.is_absolute():
            requested_path = pdf_dir / requested_path
        if requested_path.exists() and requested_path.suffix.lower() == ".pdf":
            return requested_path
        raise FileNotFoundError(f"PDF not found: {requested_path}")

    if os.getenv("TEST_RANDOM_PDF", "").lower() in {"1", "true", "yes"}:
        return random.choice(pdf_files)

    print("Available PDFs:")
    for index, pdf in enumerate(pdf_files, start=1):
        print(f"{index}. {pdf.name}")

    choice = input("Choose PDF number: ").strip()
    if not choice.isdigit():
        raise ValueError("PDF choice must be a number")

    index = int(choice)
    if index < 1 or index > len(pdf_files):
        raise ValueError(f"PDF choice must be between 1 and {len(pdf_files)}")

    return pdf_files[index - 1]


if __name__ == "__main__":
    run_test_pdf_upload()
