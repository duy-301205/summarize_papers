"""
Generic VNU Journal Scraper
- Dùng chung cho tất cả journals trên js.vnu.edu.vn
- Chỉ cần thay journal_code để cào từ các chuyên san khác nhau

Hỗ trợ 12 journals của VNU:
- SSH: Khoa học Xã hội & Nhân văn (Việt 99%)
- ER: Nghiên cứu Giáo dục (Việt 100%)
- EAB: Kinh tế & Kinh doanh (Việt 80%+)
- LS: Luật học (Việt 95%+)
- PaM: Nghiên cứu Chính sách & Quản lý (Việt 90%+)
- FS: Nghiên cứu Nước ngoài (Việt 85%+)
- MPS: Khoa học Y Dược (Việt 80%+)
- JCSCE: Khoa học Máy tính & Kỹ thuật Truyền thông (Anh)
- NST: Khoa học Tự nhiên & Công nghệ (Việt 90%+)
- EES: Khoa học Trái đất & Môi trường (Việt 85%+)
- MAP: Toán học - Vật lý (Việt 80%+)
- AMD: Vật liệu & Linh kiện tiên tiến (Việt 85%+)
"""

import requests
from bs4 import BeautifulSoup
import time
import logging
import re
from typing import List, Optional
from pathlib import Path
from urllib.parse import urljoin
import pdfplumber

from vnu_metadata_schema import VNUArticle, MetadataManager

# Paths: script is in data/ folder, raw_metadata and raw_pdfs are siblings
SCRIPT_DIR = Path(__file__).parent  # data/
RAW_METADATA_DIR = SCRIPT_DIR / "raw_metadata"
RAW_PDFS_DIR = SCRIPT_DIR / "raw_pdfs"

# Language detection
try:
    from langdetect import detect, detect_langs, LangDetectException
    HAS_LANGDETECT = True
except ImportError:
    HAS_LANGDETECT = False
    logger_temp = logging.getLogger(__name__)
    logger_temp.warning("[WARNING] langdetect not installed. Install: pip install langdetect")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [%(levelname)s] - %(message)s'
)
logger = logging.getLogger(__name__)

# Disable SSL warning
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


class VNUGenericJournalScraper:
    """Generic scraper for VNU journals on js.vnu.edu.vn"""
    
    BASE_URL = "https://js.vnu.edu.vn"
    
    JOURNALS = {
        "SSH": {"url": "SSH", "name": "Khoa học Xã hội và Nhân văn"},
        "ER": {"url": "ER", "name": "Nghiên cứu Giáo dục"},
        "EAB": {"url": "EAB", "name": "Kinh tế và Kinh doanh"},
        "PaM": {"url": "PaM", "name": "Chính sách và Quản lý"},
        "LS": {"url": "LS", "name": "Luật học"},
        "FS": {"url": "FS", "name": "Nghiên cứu Nước ngoài"},
        "MPS": {"url": "MPS", "name": "Khoa học Y Dược"},
        "JCSCE": {"url": "index.php/jcsce", "name": "Computer Science and Cybernetics"},
        "NST": {"url": "NST", "name": "Khoa học Tự nhiên và Công nghệ"},
        "EES": {"url": "EES", "name": "Khoa học Trái đất và Môi trường"},
        "MAP": {"url": "MAP", "name": "Toán học - Vật lý"},
        "AMD": {"url": "AMD", "name": "Vật liệu và Linh kiện tiên tiến"}
    }
    
    def __init__(self, journal_code: str = "JCSCE"):
        """
        Khởi tạo scraper cho một journal cụ thể
        
        Args:
            journal_code: Mã chuyên san (JCSCE, SSH, ER, EAB)
        """
        if journal_code not in self.JOURNALS:
            raise ValueError(f"[ERROR] Journal '{journal_code}' not supported. "
                           f"Supported: {list(self.JOURNALS.keys())}")
        
        self.journal_code = journal_code
        self.journal_config = self.JOURNALS[journal_code]
        self.archive_url = f"{self.BASE_URL}/{self.journal_config['url']}/issue/archive"
        
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        self.metadata_manager = MetadataManager(output_dir=str(RAW_METADATA_DIR))
        self.article_counter = 0
        self.pdf_dir = RAW_PDFS_DIR
        self.pdf_dir.mkdir(exist_ok=True)
        
        logger.info(f"\n{'='*70}")
        logger.info(f"VNU GENERIC JOURNAL SCRAPER")
        logger.info(f"{'='*70}")
        logger.info(f"Journal: {journal_code} - {self.journal_config['name']}")
        logger.info(f"URL: {self.archive_url}")
        logger.info(f"{'='*70}\n")
    
    def _get_page(self, url: str) -> Optional[BeautifulSoup]:
        """Tải và parse một trang"""
        try:
            response = self.session.get(url, timeout=15, verify=False)
            response.encoding = 'utf-8'
            
            if response.status_code != 200:
                logger.error(f"[ERROR] HTTP {response.status_code}")
                return None
            
            return BeautifulSoup(response.text, 'html.parser')
        
        except Exception as e:
            logger.error(f"[ERROR] Lỗi tải trang: {e}")
            return None
    
    def _extract_abstract_from_html(self, soup: BeautifulSoup) -> str:
        """
        Extract FULL abstract từ HTML element trực tiếp (không từ meta tag)
        Meta tag bị giới hạn 150-160 ký tự, nên lấy từ HTML là chính
        """
        try:
            # Cách 1: Tìm <div> chứa abstract
            abstract_div = soup.find('div', attrs={'class': re.compile(r'.*abstract.*', re.I)})
            if abstract_div:
                abstract_text = abstract_div.get_text(strip=True)
                if abstract_text:
                    # Bỏ tiêu đề "Abstract:" nếu có
                    if abstract_text.startswith('Abstract:'):
                        abstract_text = abstract_text[len('Abstract:'):].strip()
                    return abstract_text  # Lấy TOÀN BỘ, không cắt
            
            # Cách 2: Tìm <p> hoặc <span> với class article-text hoặc summary
            summary = soup.find(['p', 'span'], attrs={'class': re.compile(r'.*summary|article.*text.*', re.I)})
            if summary:
                abstract_text = summary.get_text(strip=True)
                if abstract_text and len(abstract_text) > 50:
                    return abstract_text
            
            # Fallback: Dùng meta tag (cắt ở 1000 ký tự)
            desc_meta = soup.find('meta', attrs={'name': 'DC.Description'})
            if desc_meta:
                full_desc = desc_meta.get('content', '')
                if full_desc.startswith('Abstract:'):
                    full_desc = full_desc[len('Abstract:'):].strip()
                abstract_part = full_desc.split('Keywords:')[0].strip() if 'Keywords:' in full_desc else full_desc
                return abstract_part[:1000]
            
            return ""
        
        except Exception as e:
            logger.warning(f"[WARNING] Error extracting abstract: {e}")
            return ""
    
    def _extract_metadata_from_meta_tags(self, soup: BeautifulSoup) -> dict:
        """Extract metadata từ meta tags"""
        
        metadata = {
            "title": None,
            "authors": [],
            "year": 2024,
            "abstract": None,
            "pdf_url": None
        }
        
        try:
            # Title
            title_meta = soup.find('meta', attrs={'name': 'citation_title'})
            if title_meta:
                metadata['title'] = title_meta.get('content', '').strip()
            else:
                title_meta = soup.find('meta', attrs={'name': 'DC.Title'})
                if title_meta:
                    metadata['title'] = title_meta.get('content', '').strip()
            
            # Authors (lặp lại)
            author_metas = soup.find_all('meta', attrs={'name': 'citation_author'})
            for meta in author_metas:
                author = meta.get('content', '').strip()
                if author and author not in metadata['authors']:
                    metadata['authors'].append(author)
            
            if not metadata['authors']:
                creator_metas = soup.find_all('meta', attrs={'name': 'DC.Creator.PersonalName'})
                for meta in creator_metas:
                    author = meta.get('content', '').strip()
                    if author and author not in metadata['authors']:
                        metadata['authors'].append(author)
            
            # Year
            issued_meta = soup.find('meta', attrs={'name': 'DC.Date.issued'})
            if issued_meta:
                date_str = issued_meta.get('content', '')
                year_match = re.search(r'(20\d{2})', date_str)
                if year_match:
                    metadata['year'] = int(year_match.group(1))
            
            # Abstract - LẤY TỪ HTML TRỰC TIẾP (không meta tag bị cắt cụt)
            metadata['abstract'] = self._extract_abstract_from_html(soup)
            
            # PDF URL - Tìm từ HTML link (obj_galley_link) thay vì meta tag
            pdf_meta = soup.find('meta', attrs={'name': 'citation_pdf_url'})
            if pdf_meta:
                pdf_url = pdf_meta.get('content', '')
                if pdf_url:
                    if not pdf_url.startswith('http'):
                        pdf_url = urljoin(self.BASE_URL, pdf_url)
                    metadata['pdf_url'] = pdf_url
            else:
                # Tìm PDF link từ HTML element (obj_galley_link)
                pdf_link = soup.find('a', attrs={'class': re.compile(r'obj_galley_link')})
                if pdf_link:
                    pdf_href = pdf_link.get('href', '')
                    if pdf_href:
                        if not pdf_href.startswith('http'):
                            pdf_href = urljoin(self.BASE_URL, pdf_href)
                        metadata['pdf_url'] = pdf_href
        
        except Exception as e:
            logger.warning(f"[WARNING] Lỗi extract metadata: {e}")
        
        return metadata
    
    def _detect_language_from_text(self, text: str) -> str:
        """
        Detect language từ text (abstract, title)
        Returns: 'vi' (Vietnamese), 'en' (English), or 'unknown'
        """
        if not text or len(text) < 20:
            return "unknown"
        
        if not HAS_LANGDETECT:
            return "unknown"
        
        try:
            # Detect language
            lang = detect(text)
            return lang
        except LangDetectException:
            return "unknown"
        except Exception as e:
            logger.warning(f"[WARNING] Lỗi detect language: {e}")
            return "unknown"
    

    def _get_pdf_text_sample(self, pdf_path: str, max_pages: int = 3) -> str:
        """
        Extract text từ PDF - dùng cho language detection
        Lấy từ first max_pages pages
        """
        try:
            import pdfplumber
            text = ""
            with pdfplumber.open(pdf_path) as pdf:
                for page_num in range(min(max_pages, len(pdf.pages))):
                    page_text = pdf.pages[page_num].extract_text()
                    if page_text:
                        text += page_text + " "
            return text[:2000]  # Return first 2000 chars for detection
        except Exception as e:
            logger.warning(f"[WARNING] Error extracting PDF text: {e}")
            return ""
    
    def _is_vietnamese_pdf(self, pdf_path: str, article_title: str = "") -> bool:
        """
        Check nếu PDF content là tiếng Việt (based on actual text)
        Return: True nếu Vietnamese, False nếu English/Other
        """
        text = self._get_pdf_text_sample(pdf_path)
        
        if not text or len(text.strip()) < 50:
            # Không extract được text - skip
            logger.warning(f"[WARNING] Could not extract PDF text: {article_title[:40]}")
            return False
        
        detected_lang = self._detect_language_from_text(text)
        
        if detected_lang == "vi":
            return True
        else:
            logger.info(f"  ⊘ PDF is {detected_lang.upper()} - Skipping")
            return False
    
    def _extract_article_from_detail_page(self, article_url: str) -> Optional[VNUArticle]:
        """Vào trang chi tiết và vét toàn bộ metadata"""
        
        try:
            soup = self._get_page(article_url)
            if not soup:
                return None
            
            self.article_counter += 1
            article_id = f"{self.journal_code}_{self.article_counter:04d}"
            
            logger.info(f"[OK] Processing: {article_url[:60]}...")
            
            # Extract metadata từ meta tags
            metadata = self._extract_metadata_from_meta_tags(soup)
            
            # Download PDF nếu có URL
            pdf_path = None
            if metadata['pdf_url']:
                expected_pdf = self.pdf_dir / f"{article_id}.pdf"
                
                # Nếu PDF đã tồn tại → skip download, dùng lại file cũ
                if expected_pdf.exists():
                    pdf_path = expected_pdf
                    logger.info(f"  [SKIP] PDF already exists, reusing")
                else:
                    try:
                        response = self.session.get(metadata['pdf_url'], timeout=30, verify=False)
                        if response.status_code == 200:
                            pdf_path = expected_pdf
                            with open(pdf_path, 'wb') as f:
                                f.write(response.content)
                            
                            # CHECK: Verify PDF is actually Vietnamese
                            if not self._is_vietnamese_pdf(str(pdf_path), metadata['title']):
                                # Delete non-Vietnamese PDF
                                pdf_path.unlink()
                                logger.info(f"  [SKIP] Article skipped (not Vietnamese)")
                                return None
                            else:
                                logger.info(f"  [OK] PDF verified Vietnamese")
                    except:
                        pass
            
            # Tạo article
            article = VNUArticle(
                id=article_id,
                title=metadata['title'] or "Unknown",
                authors=metadata['authors'] or ["Unknown"],
                year=metadata['year'],
                abstract=metadata['abstract'] or "",
                journal=self.journal_config['name'],
                url=article_url,
                pdf_url=metadata['pdf_url'],
                pdf_path=str(pdf_path) if pdf_path else None,
                download_status="success" if pdf_path else "pending"
            )
            
            # Log
            if article.title != "Unknown":
                logger.info(f"  Title: {article.title[:50]}...")
            if article.authors != ["Unknown"]:
                logger.info(f"  Authors: {', '.join(article.authors[:2])}")
            if article.abstract:
                logger.info(f"  Abstract: {article.abstract[:60]}...")
            if pdf_path:
                logger.info(f"  [OK] PDF downloaded")
            
            return article
        
        except Exception as e:
            logger.error(f"[ERROR] Lỗi: {e}")
            return None
    
    def scrape_issues(self, max_articles: int = 10, max_issues: int = None) -> List[VNUArticle]:
        """
        Cào bài báo từ các issues
        
        Args:
            max_articles: Tối đa số lượng bài báo
            max_issues: Tối đa số issues để cào (None = không giới hạn)
        """
        
        articles = []
        
        try:
            # Tải trang lưu trữ issues
            logger.info(f"[PAGE] Tải archive...")
            soup = self._get_page(self.archive_url)
            if not soup:
                logger.error("[ERROR] Không tải được issue archive")
                return articles
            
            logger.info(f"[OK] Archive loaded\n")
            
            # Lấy danh sách issue links
            issue_links = []
            try:
                for link in soup.find_all('a', href=re.compile(r'/issue/view/')):
                    href = link.get('href', '')
                    if href:
                        issue_url = urljoin(self.BASE_URL, href)
                        issue_links.append(issue_url)
                
                logger.info(f"Found {len(issue_links)} issues")
                
                if max_issues:
                    issue_links = issue_links[:max_issues]
                    logger.info(f"Scraping first {len(issue_links)} issues\n")
            
            except Exception as e:
                logger.error(f"[ERROR] Lỗi lấy issue links: {e}")
                return articles
            
            # Duyệt từng issue
            for issue_idx, issue_url in enumerate(issue_links, 1):
                if len(articles) >= max_articles:
                    logger.info(f"\n[OK] Reached limit of {max_articles} articles")
                    break
                
                logger.info(f"\n{'='*70}")
                logger.info(f"ISSUE {issue_idx}: {issue_url[-20:]}")
                logger.info(f"{'='*70}")
                
                issue_soup = self._get_page(issue_url)
                if not issue_soup:
                    continue
                
                time.sleep(0.5)  # Rate limit
                
                # Lấy article links - CHỈ lấy URL dạng /article/view/{ID} (không variant)
                article_links = []
                article_ids_seen = set()  # Deduplicate
                try:
                    for link in issue_soup.find_all('a', href=re.compile(r'/article/view/')):
                        href = link.get('href', '')
                        if href and '/article/view/' in href:
                            # FIX: Bỏ qua URL variant (/4084/208) - chỉ lấy /4084
                            # Extract article ID từ /article/view/4084 hoặc /article/view/4084/208
                            match = re.search(r'/article/view/(\d+)', href)
                            if match:
                                article_id = match.group(1)
                                # Chỉ lấy 1 lần cho mỗi ID (deduplicate)
                                if article_id not in article_ids_seen:
                                    article_ids_seen.add(article_id)
                                    # Xây dựng URL hoàn chỉnh - bỏ variant
                                    clean_url = re.sub(r'/article/view/\d+(?:/\d+)?', f'/article/view/{article_id}', href)
                                    article_url = urljoin(self.BASE_URL, clean_url)
                                    article_links.append(article_url)
                    
                    logger.info(f"Found {len(article_links)} articles (after deduplication)")
                
                except Exception as e:
                    logger.error(f"[ERROR] Lỗi lấy article links: {e}")
                    continue
                
                # Xử lý từng article
                for art_idx, article_url in enumerate(article_links, 1):
                    if len(articles) >= max_articles:
                        break
                    
                    article = self._extract_article_from_detail_page(article_url)
                    if article:
                        articles.append(article)
                        self.metadata_manager.add_article_safe(article)
                    
                    time.sleep(0.5)  # Rate limit
        
        except Exception as e:
            logger.error(f"[ERROR] Lỗi: {e}")
        
        finally:
            logger.info(f"\n{'='*70}")
            logger.info(f"[OK] SCRAPING COMPLETED")
            logger.info(f"{'='*70}")
            logger.info(f"Total: {len(articles)} articles")
            
            if articles:
                logger.info(f"\nSaving metadata...")
                self.metadata_manager.save_to_json()
                self.metadata_manager.save_to_csv()
                logger.info(f"[OK] Metadata saved successfully")
        
        return articles


if __name__ == "__main__":
    try:
        # PRODUCTION RUN: Scrape all 12 journals for 2000+ Vietnamese articles
        journals_to_scrape = ["SSH", "ER", "EAB", "LS", "PaM", "FS", "MPS", "JCSCE", "NST", "EES", "MAP", "AMD"]
        
        # Create shared metadata manager (optimize: load JSON once)
        shared_metadata_manager = MetadataManager(output_dir=str(RAW_METADATA_DIR))
        initial_count = len(shared_metadata_manager.articles)
        logger.info(f"\n[INFO] Loaded {initial_count} existing articles from disk")
        
        for journal_code in journals_to_scrape:
            try:
                logger.info(f"\n\n{'#'*70}")
                logger.info(f"SCRAPING: {journal_code}")
                logger.info(f"{'#'*70}\n")
                
                scraper = VNUGenericJournalScraper(journal_code=journal_code)
                # Reuse shared metadata manager instead of creating new one
                scraper.metadata_manager = shared_metadata_manager
                
                # Production: Scrape 400 articles per journal
                # SSH: ~99% Vietnamese -> ~390 articles
                # ER: ~100% Vietnamese -> ~400 articles  
                # EAB: ~80%+ Vietnamese -> ~320 articles
                # LS: ~95%+ Vietnamese -> ~380 articles
                # PaM: ~90%+ Vietnamese -> ~360 articles
                # FS: ~85%+ Vietnamese -> ~340 articles
                # MPS: ~80%+ Vietnamese -> ~320 articles
                # JCSCE: English (skip via PDF filter) -> ~0 articles
                # NST: ~90%+ Vietnamese -> ~360 articles
                # EES: ~85%+ Vietnamese -> ~340 articles
                # MAP: ~80%+ Vietnamese -> ~320 articles
                # AMD: ~85%+ Vietnamese -> ~340 articles
                # Expected total: ~2000+ Vietnamese articles
                articles = scraper.scrape_issues(max_articles=400, max_issues=25)
                
                logger.info(f"\n[OK] {journal_code}: {len(articles)} articles added")
                
            except Exception as e:
                logger.error(f"[ERROR] Error with {journal_code}: {e}")
        
        logger.info(f"\n\n{'='*70}")
        logger.info(f"SUMMARY: 12 JOURNALS SCRAPE COMPLETED")
        logger.info(f"{'='*70}")
        
        total_count = len(shared_metadata_manager.articles)
        new_articles = total_count - initial_count
        logger.info(f"Initial articles: {initial_count}")
        logger.info(f"New articles added: {new_articles}")
        logger.info(f"Total Vietnamese articles: {total_count}")
        logger.info(f"Expected: ~2000+ articles (from 12 journals)")
        
        # Save once at the end
        if new_articles > 0:
            logger.info(f"\n[INFO] Saving all metadata to disk...")
            shared_metadata_manager.save_to_json()
            shared_metadata_manager.save_to_csv()
            logger.info(f"[OK] Metadata saved successfully")
        
    except Exception as e:
        logger.error(f"[ERROR] Lỗi: {e}")
        import traceback
        traceback.print_exc()
