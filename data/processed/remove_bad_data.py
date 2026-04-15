import json

# 1. Đọc file JSON sạch (Vừa chạy từ V4 xong)
json_file = "vnu_articles_metadata_cleaned.json"
with open(json_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Tổng số bài báo ban đầu: {len(data)}")

# 2. Xóa 3 "nội gián" bị lộn file PDF
bad_ids = ['SSH_0063', 'SSH_0194', 'SSH_0195']
final_data = [art for art in data if art.get('id') not in bad_ids]

# Lọc nốt những bài rỗng (Nếu có)
final_data = [art for art in final_data if art.get('extraction_status') == 'success']

# 3. Khử trùng lặp tiêu đề (Giữ lại bài dài nhất y như cũ)
# Sắp xếp data theo Tiêu đề và Số từ giảm dần
final_data.sort(key=lambda x: (x.get('title', ''), x.get('word_count', 0)), reverse=True)

unique_data = []
seen_titles = set()
for art in final_data:
    title = art.get('title')
    if title not in seen_titles:
        unique_data.append(art)
        seen_titles.add(title)

print(f"Tổng số bài báo SẠCH - CHUẨN - KHÔNG TRÙNG cuối cùng: {len(unique_data)}")

# 4. Xuất ra file Final
with open("vnu_articles_metadata_final.json", 'w', encoding='utf-8') as f:
    json.dump(unique_data, f, ensure_ascii=False, indent=2)

print("✅ Đã xuất file Final thành công!")