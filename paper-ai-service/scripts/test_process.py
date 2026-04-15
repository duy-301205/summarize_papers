from app.data.processed.parser import PDFParser
from app.data.processed.cleaner import TextCleaner
from app.data.processed.structurer import DataStructurer
import os

def main():
    # Đường dẫn file của Duy
    input_pdf = "storage/raw_pdfs/EAB_0003.pdf"
    output_json = "storage/processed_json/EAB_0003.json"
    
    # Khởi tạo các class
    parser = PDFParser()
    cleaner = TextCleaner()
    structurer = DataStructurer()

    print(f"🚀 Đang xử lý file: {input_pdf}")

    # Bước 1: Parse
    raw_pages = parser.parse(input_pdf)
    
    # Bước 2: Clean từng trang
    cleaned_pages = []
    for p in raw_pages:
        cleaned_pages.append({
            "page": p["page"],
            "content": cleaner.clean(p["content"])
        })

    # Bước 3: Structure & Save
    final_result = structurer.structure(cleaned_pages, "EAB_0003.pdf")
    structurer.save_to_json(final_result, output_json)

if __name__ == "__main__":
    main()