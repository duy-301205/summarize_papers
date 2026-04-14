import pandas as pd
import json

# 1. Đọc file JSON đã làm sạch
json_file = "vnu_articles_metadata_cleaned.json"
with open(json_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

# 2. Chuyển thành DataFrame
df = pd.DataFrame(data)

# 3. Xuất ra CSV (Lưu ý: Dùng utf-8-sig để Excel trên Windows đọc tiếng Việt không bị lỗi font)
csv_file = "vnu_articles_metadata_cleaned.csv"
df.to_csv(csv_file, index=False, encoding='utf-8-sig')

print(f"Đã xuất thành công {len(df)} bài báo ra file {csv_file}")