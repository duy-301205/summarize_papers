#!/usr/bin/env python3
"""Export current articles to JSON and CSV"""

from vnu_metadata_schema import MetadataManager
import json
import csv
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent

# Load existing articles
metadata_mgr = MetadataManager(output_dir=str(PROJECT_ROOT / "raw_metadata"))

print("\n" + "="*80)
print("EXPORTING: Current articles to JSON and CSV")
print("="*80 + "\n")

# Save to JSON
metadata_mgr.save_to_json()
print("✓ Saved: raw_metadata/vnu_articles_metadata.json")

# Save to CSV
metadata_mgr.save_to_csv()
print("✓ Saved: raw_metadata/vnu_articles_metadata.csv")

# Show stats
with open(PROJECT_ROOT / 'raw_metadata/vnu_articles_metadata.json', encoding='utf-8') as f:
    data = json.load(f)
    print(f"\nTotal articles: {len(data)}")

# Save flat CSV (one-line per record, no embedded newlines)
flat_csv_path = PROJECT_ROOT / 'raw_metadata/vnu_articles_metadata_flat.csv'
if data:
    with open(flat_csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=data[0].keys())
        writer.writeheader()
        for row in data:
            cleaned_row = {
                key: (value.replace('\r', ' ').replace('\n', ' ').strip() if isinstance(value, str) else value)
                for key, value in row.items()
            }
            writer.writerow(cleaned_row)
    print("✓ Saved: raw_metadata/vnu_articles_metadata_flat.csv (click-safe)")
    
print("\n" + "="*80 + "\n")
