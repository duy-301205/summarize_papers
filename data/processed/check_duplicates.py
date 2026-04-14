import json
from collections import Counter

def audit_json_duplicates(json_file_path):
    print(f"🔍 Đang quét file: {json_file_path}...\n" + "="*50)
    
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    print(f"📊 Tổng số bản ghi (bài báo) trong JSON: {len(data)}\n")

    # 1. Kiểm tra trùng lặp đường dẫn PDF (Cùng 1 file bị trích xuất 2 lần)
    pdf_paths = [art.get('pdf_path') for art in data if art.get('pdf_path')]
    pdf_counts = Counter(pdf_paths)
    dup_pdfs = {path: count for path, count in pdf_counts.items() if count > 1}
    
    if dup_pdfs:
        print("🚨 PHÁT HIỆN TRÙNG LẶP FILE PDF:")
        for path, count in dup_pdfs.items():
            print(f"   - File: {path} (Xuất hiện {count} lần)")
    else:
        print("✅ Tuyệt vời! Không có file PDF nào bị trích xuất trùng lặp.")

    print("-" * 50)

    # 2. Kiểm tra trùng lặp Tiêu đề (Cùng 1 bài báo nhưng tải về thành 2 file PDF khác nhau)
    titles = [art.get('title') for art in data if art.get('title')]
    title_counts = Counter(titles)
    dup_titles = {title: count for title, count in title_counts.items() if count > 1}
    
    if dup_titles:
        print("🚨 PHÁT HIỆN TRÙNG LẶP TIÊU ĐỀ (Có thể khác file PDF nhưng cùng nội dung):")
        for title, count in dup_titles.items():
            print(f"   - Tiêu đề: '{title}' (Xuất hiện {count} lần)")
    else:
        print("✅ Tuyệt vời! Không có Tiêu đề bài báo nào bị trùng.")

    print("=" * 50)
    print(f"🛠️  Tổng kết: Có {len(dup_pdfs)} PDF trùng và {len(dup_titles)} Tiêu đề trùng.")

if __name__ == "__main__":
    # Thay tên file này nếu của bạn khác
    JSON_FILE = "./vnu_articles_metadata_cleaned.json" 
    audit_json_duplicates(JSON_FILE)