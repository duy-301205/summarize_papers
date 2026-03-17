"""
VNU Metadata Schema - Định nghĩa cấu trúc dữ liệu chuẩn
"""
from dataclasses import dataclass, asdict
from datetime import datetime
from typing import Optional, List
import json
from pathlib import Path


@dataclass
class VNUArticle:
    """
    Cấu trúc metadata cho một bài báo khoa học
    
    12 trường chủ yếu:
    - id, title, authors, year, abstract
    - journal, pdf_url, pdf_path, url
    - scraped_date, language, download_status
    """
    id: str
    title: str
    authors: List[str]
    year: int
    abstract: str
    journal: Optional[str] = None
    pdf_url: Optional[str] = None
    pdf_path: Optional[str] = None
    url: Optional[str] = None
    scraped_date: str = None
    language: str = "vi"
    download_status: str = "pending"
    
    def __post_init__(self):
        if self.scraped_date is None:
            self.scraped_date = datetime.now().isoformat()
    
    def to_dict(self):
        """Chuyển thành dictionary"""
        return asdict(self)
    
    def to_dict_clean(self):
        """Chuyển thành dictionary"""
        return asdict(self)
    
    def to_json(self):
        """Chuyển thành JSON string"""
        return json.dumps(self.to_dict(), ensure_ascii=False, indent=2)


class MetadataManager:
    """
    Quản lý lưu trữ và truy vấn metadata
    
    Tính năng:
    - Checkpoint: Kiểm tra article đã tồn tại trước khi thêm
    - Persistence: Lưu/tải dữ liệu từ JSON/CSV
    - Analytics: Thống kê cho BI (Apache Superset)
    """
    
    def __init__(self, output_dir: str = None):
        if output_dir is None:
            # Default: raw_metadata sibling in data/ folder
            output_dir = str(Path(__file__).parent / "raw_metadata")
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.articles: List[VNUArticle] = []
        self.article_ids: set = set()  # Dùng cho Checkpoint - O(1) lookup
        
        # Auto-load existing data nếu có
        existing_json = self.output_dir / "vnu_articles_metadata.json"
        if existing_json.exists():
            self.load_from_json("vnu_articles_metadata.json")
    
    def add_article(self, article: VNUArticle):
        """Thêm một bài báo vào danh sách"""
        self.articles.append(article)
        self.article_ids.add(article.id)
    
    def add_article_safe(self, article: VNUArticle) -> bool:
        """
        Thêm bài báo với kiểm tra Checkpoint
        
        Returns:
            True nếu bài báo mới được thêm
            False nếu bài báo đã tồn tại
        """
        if self.article_exists(article.id):
            return False
        
        self.add_article(article)
        return True
    
    def article_exists(self, article_id: str) -> bool:
        """
        Kiểm tra bài báo đã tồn tại chưa (O(1) lookup)
        
        Args:
            article_id: ID bài báo (VD: VNU_0001)
            
        Returns:
            True nếu đã tồn tại, False nếu chưa
        """
        return article_id in self.article_ids
    
    def save_to_json(self, filename: str = "vnu_articles_metadata.json"):
        """
        Lưu tất cả metadata vào file JSON (CHỈ lưu fields cần thiết)
        """
        output_path = self.output_dir / filename
        data = [article.to_dict_clean() for article in self.articles]
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"[OK] Saved {len(self.articles)} articles to: {output_path}")
        return output_path
    
    def save_to_csv(self, filename: str = "vnu_articles_metadata.csv"):
        """
        Lưu metadata vào file CSV (cho Apache Superset) - CHỈ fields cần thiết
        """
        import csv
        output_path = self.output_dir / filename
        
        if not self.articles:
            print("[WARN] No articles to save")
            return None
        
        keys = self.articles[0].to_dict_clean().keys()
        
        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            for article in self.articles:
                writer.writerow(article.to_dict_clean())
        
        print(f"[OK] Saved {len(self.articles)} articles to: {output_path}")
        return output_path
    
    def load_from_json(self, filename: str = "vnu_articles_metadata.json"):
        """
        Tải metadata từ file JSON
        """
        input_path = self.output_dir / filename
        
        if not input_path.exists():
            print(f"[WARN] File not found: {input_path}")
            return []
        
        with open(input_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Filter out deprecated fields that no longer exist in VNUArticle
        deprecated_fields = {'keywords', 'content_cleaned', 'download_error', 'volume', 'issue', 'pages'}
        
        self.articles = [VNUArticle(**{k: v for k, v in item.items() if k not in deprecated_fields}) for item in data]
        
        # Rebuild article_ids set cho Checkpoint
        self.article_ids = {article.id for article in self.articles}
        
        print(f"[OK] Loaded {len(self.articles)} articles from: {input_path}")
        return self.articles
    
    def get_articles_by_year(self, year: int):
        """Lấy bài báo theo năm"""
        return [a for a in self.articles if a.year == year]
    
    def get_articles_by_journal(self, journal_name: str):
        """Lấy bài báo theo tên tạp chí"""
        return [a for a in self.articles if a.journal_name == journal_name]
    
    def stats(self):
        """Thống kê dữ liệu"""
        if not self.articles:
            return {"total": 0}
        
        years = [a.year for a in self.articles]
        journals = [a.journal_name for a in self.articles if a.journal_name]
        
        return {
            "total": len(self.articles),
            "years": list(set(years)),
            "journals": list(set(journals)),
            "year_range": f"{min(years)}-{max(years)}" if years else "N/A"
        }


if __name__ == "__main__":
    # Test cấu trúc dữ liệu
    article = VNUArticle(
        id="VNU_001",
        title="Nghiên cứu về học máy tại Việt Nam",
        authors=["Nguyễn Văn A", "Trần Thị B"],
        year=2024,
        abstract="Bài báo này trình bày các phương pháp học máy...",
        journal="Tạp chí Khoa học VNU",
        url="https://js.vnu.edu.vn/...",
        pdf_url="https://js.vnu.edu.vn/article/view/123/456.pdf",
        pdf_path="raw_pdfs/VNU_001.pdf",
        language="vi",
        download_status="success"
    )
    
    print("✓ Cấu trúc dữ liệu test (12 fields):")
    print(article.to_json())
