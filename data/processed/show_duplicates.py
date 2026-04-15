import json
from collections import Counter

def show_duplicate_details(json_file_path):
    print("🔍 ĐANG TRÍCH XUẤT CHI TIẾT CÁC BÀI BÁO BỊ TRÙNG...\n" + "="*70)
    
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Đếm tiêu đề
    titles = [art.get('title') for art in data if art.get('title')]
    title_counts = Counter(titles)
    
    # Lọc ra những tiêu đề xuất hiện > 1 lần
    dup_titles = {title: count for title, count in title_counts.items() if count > 1}

    if not dup_titles:
        print("Không có tiêu đề trùng lặp nào.")
        return

    # In chi tiết từng bài
    for title in dup_titles:
        print(f"\n📌 TIÊU ĐỀ: {title}")
        
        # Tìm tất cả các bài báo có tiêu đề này
        matching_articles = [art for art in data if art.get('title') == title]
        
        for idx, art in enumerate(matching_articles, 1):
            pdf_path = art.get('pdf_path', 'N/A')
            word_count = art.get('word_count', 0)
            status = art.get('extraction_status', 'N/A')
            
            print(f"   [Bản {idx}] - PDF: {pdf_path}")
            print(f"            - Trạng thái: {status} | Số từ: {word_count}")
            
    print("\n" + "="*70)

if __name__ == "__main__":
    JSON_FILE = "./vnu_articles_metadata_cleaned.json" 
    show_duplicate_details(JSON_FILE)