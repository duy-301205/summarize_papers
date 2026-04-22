# test pipeline
import os
import sys
import json
from pathlib import Path

# Thêm thư mục root (paper-ai-service) vào PYTHONPATH để import được 'app'
project_root = Path(__file__).resolve().parent.parent
sys.path.append(str(project_root))

from tqdm import tqdm

from app.data.processed.parser import PDFParser
from app.data.processed.cleaner import TextCleaner
from app.data.chunking.recursive_chunk import TextChunker
from app.models.embedding.e5_embedding import E5Embedder
from app.vector_store.base_store import ChromaDBStore

def run_test_pdf_upload():
    print("="*50)
    print("🚀 TEST LUỒNG UPLOAD PDF WEB (KHÔNG DÙNG JSON)")
    print("="*50)
    
    # Giả lập: Người dùng "upload" 10 file PDF vào thư mục storage/pdfs
    project_root = Path(__file__).resolve().parent.parent
    pdf_dir = project_root / "storage" / "raw_pdfs" 
    db_dir = str(project_root / "storage" / "vector_db")
    
    if not pdf_dir.exists() or len(list(pdf_dir.glob("*.pdf"))) == 0:
        print(f"❌ Vui lòng tạo thư mục {pdf_dir} và thả 10 file PDF VNU vào đây để test!")
        return
        
    pdf_files = list(pdf_dir.glob("*.pdf"))
    
    chunker = TextChunker()
    all_chunks = []
    all_metadatas = []
    
    # MÔ PHỎNG LUỒNG WEB: DUYỆT TỪNG FILE NHƯ APP ĐANG XỬ LÝ
    for pdf_path in tqdm(pdf_files, desc="Đang xử lý PDF"):
        # 1. Đọc thô (Parser)
        raw_text = PDFParser.extract_text_2_columns(str(pdf_path))
        if not raw_text: continue
            
        # 2. Làm sạch (Cleaner)
        clean_text = TextCleaner.clean_vnu_text(raw_text)
        if not clean_text or len(clean_text) < 100: continue
            
        # 3. Băm nhỏ (Chunker)
        chunks = chunker.split_text(clean_text)
        for i, chunk_text in enumerate(chunks):
            all_chunks.append(f"passage: {chunk_text}")
            all_metadatas.append({
                "source_file": pdf_path.name, # Lưu tên file PDF để biết xuất xứ
                "chunk_index": i
            })
            
    print(f"🔪 Đã băm được {len(all_chunks)} đoạn chunks từ {len(pdf_files)} file PDF.")
    
    # ---------------------------------------------------------
    # DEBUG: LƯU JSON ĐỂ KIỂM TRA MẮT XEM CHUNK CÓ BỊ GÃY KHÔNG
    json_dir = project_root / "storage" / "processd_json"
    json_dir.mkdir(parents=True, exist_ok=True)
    
    debug_data = []
    for chunk_text, meta in zip(all_chunks, all_metadatas):
        debug_data.append({
            "metadata": meta,
            "content": chunk_text
        })
        
    json_path = json_dir / "test_chunks_debug.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(debug_data, f, ensure_ascii=False, indent=4)
    print(f"📄 Đã lưu file kiểm tra tại: {json_path}")
    # ---------------------------------------------------------
    
    # 4. Nhúng Số (Embedder)
    print("🧠 Đang load model nhúng...")
    e5_model = E5Embedder().get_model()
    
    # 5. Lưu Database (Vector DB)
    print(f"💾 Đang ném vector vào ChromaDB: {db_dir}")
    db_store = ChromaDBStore(embeddings_model=e5_model, db_dir=db_dir)
    db_store.save_vectors(all_chunks, all_metadatas)
    
    print("🎉 THÀNH CÔNG! LUỒNG XỬ LÝ PDF CỦA WEB ĐÃ CHẠY CHUẨN.")

if __name__ == "__main__":
    run_test_pdf_upload()