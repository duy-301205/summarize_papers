import json
import os
from pathlib import Path
from tqdm import tqdm

# Đồ nghề LangChain
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# ==========================================

def build_vector_database():
    # 1. Đường dẫn file
    project_root = Path(__file__).parent.parent
    json_path = project_root / "data" / "processed" / "vnu_articles_metadata_cleaned.json"
    db_dir = str(project_root / "data" / "vector_db") # Nơi lưu Database
    
    # 2. Cài đặt "Máy băm" (Text Splitter)
    # chunk_size: Độ dài mỗi đoạn (khoảng 1000 ký tự, tương đương ~250 từ)
    # chunk_overlap: Đoạn sau gối đầu lên đoạn trước 200 ký tự để không mất ngữ cảnh
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", "(?<=\. )", " ", ""]
    )

    print(" Đang đọc dữ liệu từ JSON...")
    with open(json_path, 'r', encoding='utf-8') as f:
        articles = json.load(f)

    # Lọc các bài bóc text thành công
    valid_articles = [a for a in articles if a.get('extraction_status') == 'success' and a.get('content_cleaned')]
    print(f" Tìm thấy {len(valid_articles)} bài báo hợp lệ.")

    all_chunks = []
    all_metadatas = []

    print(" Đang băm Chunk...")
    for art in tqdm(valid_articles, desc="Chunking"):
        text_content = art['content_cleaned']
        
        # Lệnh này sẽ tự động chặt cục text dài thành nhiều khúc
        chunks = text_splitter.split_text(text_content)
        
        # Gắn thẻ căn cước (Metadata) cho từng khúc
        for i, chunk_text in enumerate(chunks):
            all_chunks.append(chunk_text)
            all_metadatas.append({
                "article_id": art['id'],
                "title": art['title'],
                "year": art.get('year', 0), # Lấy năm xuất bản nếu có
                "chunk_index": i
            })
            
    print(f" Đã băm thành {len(all_chunks)} đoạn chunks!")

    print(" Đang nhúng (Embedding) và lưu vào ChromaDB...")
    embeddings = HuggingFaceEmbeddings(
        model_name="all-MiniLM-L6-v2",  # Model phổ biến, hỗ trợ tốt
        model_kwargs={'device': 'cpu'}  # Sử dụng CPU (thay 'cuda' để dùng GPU nếu có)
    )
    
    # Lệnh này thực hiện Giai đoạn 2 (Nhúng) + Lưu vào ổ cứng
    vector_db = Chroma.from_texts(
        texts=all_chunks,
        embedding=embeddings,
        metadatas=all_metadatas,
        persist_directory=db_dir
    )
    
    print(f" Vector Database đã được xây xong tại: {db_dir}")

if __name__ == "__main__":
    build_vector_database()