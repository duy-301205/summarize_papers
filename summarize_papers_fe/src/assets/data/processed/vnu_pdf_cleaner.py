import json
import re
import unicodedata
from pathlib import Path
import logging
from tqdm import tqdm
import fitz  # BẮT BUỘC DÙNG PyMuPDF (fitz) ĐỂ TRỊ 2 CỘT

# Thiết lập log
logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')

def clean_vnu_text(raw_text: str) -> str:
    if not raw_text:
        return ""

    # ===== CẤP ĐỘ 1: XÓA RÁC HIỂN THỊ CƠ BẢN =====
    lines = raw_text.split('\n')
    filtered_lines = []
    for line in lines:
        line_strip = line.strip()
        # Xóa số trang
        if line_strip.isdigit() and len(line_strip) <= 3:
            continue
        # Xóa Header tạp chí
        if any(x in line for x in ["Tạp chí Khoa học ĐHQGHN", "VNU Journal of Science", "J. Sci. ĐHQGHN"]):
            continue
        # Xóa dòng kẻ gạch
        if re.match(r'^\s*[-─═_]+\s*$', line_strip):
            continue
        filtered_lines.append(line_strip)
        
    text = '\n'.join(filtered_lines)

    # ===== CẤP ĐỘ 2: CHẶT ĐẦU & CẮT ĐUÔI =====
    
    # CHẶT ĐẦU (1): Quét mục 1 (Mở đầu / Đặt vấn đề)
    head_patterns = [r'1\.\s*Mở đầu', r'1\.\s*Đặt vấn đề', r'1\.\s*Introduction', r'1\.\s*Giới thiệu']
    is_head_chopped = False
    for pattern in head_patterns:
        split_result = re.split(pattern, text, maxsplit=1, flags=re.IGNORECASE)
        if len(split_result) > 1:
            text = "1. Mở đầu " + split_result[1]
            is_head_chopped = True
            break

    # CHẶT ĐẦU (2) - BỌC LÓT: Xử lý cả lỗi gõ sai chính tả oá/óa
    if not is_head_chopped:
        keyword_patterns = [r'(Từ\s*khóa|Từ\s*khoá|Keywords?)\s*[:：][^\n]*\n']
        for pattern in keyword_patterns:
            match = re.search(pattern, text, flags=re.IGNORECASE)
            if match:
                text = text[match.end():] # Lấy từ sau dòng Từ khóa trở đi
                break

    # CẮT ĐUÔI: Xóa Tài liệu tham khảo
    tail_patterns = [r'Tài\s*liệu\s*tham\s*khảo', r'TÀI\s*LIỆU\s*THAM\s*KHẢO', r'References?']
    for pattern in tail_patterns:
        split_result = re.split(pattern, text, maxsplit=1, flags=re.IGNORECASE)
        if len(split_result) > 1:
            text = split_result[0]
            break
            
    # ===== CẤP ĐỘ 3: CHARACTER CLEANING =====
    
    # Xóa trích dẫn [1], [1, tr. 14]
    text = re.sub(r'\[\d+[^\]]*\]', '', text)
    
    # Nối từ bị gãy (phát tri- \n ển)
    text = re.sub(r'-\s*\n\s*', '', text)
    
    # Nối câu
    text = re.sub(r'(?<![.!?;:\)\'\"])\n+', ' ', text)
    
    # Xóa khoảng trắng thừa
    text = re.sub(r'[ \t]+', ' ', text)
    
    # Chuẩn hóa Tiếng Việt (NFC)
    text = unicodedata.normalize('NFC', text)
    
    return text.strip()


def extract_text_2_columns(pdf_path: Path) -> str:
    """Lõi bóc tách siêu việt: Chẻ đôi trang giấy trị dính cột & Bắn tỉa Footnote"""
    text = ""
    try:
        with fitz.open(pdf_path) as doc:
            for page in doc:
                page_width = page.rect.width
                mid_point = page_width / 2
                
                blocks = page.get_text("blocks")
                left_col = []
                right_col = []
                
                for b in blocks:
                    if b[6] == 0:  # Chỉ lấy block văn bản
                        block_text = b[4].strip()
                        
                        # 1. LỌC RÁC EMAIL BẤT CHẤP VỊ TRÍ
                        if "Email:" in block_text or "@" in block_text:
                            continue
                        
                        # 2. LỌC DÒNG KẺ CHÚ THÍCH (_________)
                        if re.match(r'^_+$', block_text):
                            continue

                        # 3. LỌC FOOTNOTE BẰNG NGỮ NGHĨA KẾT HỢP TỌA ĐỘ
                        # (Chỉ bắt các chú thích nằm ở nửa dưới của trang giấy để tránh xóa nhầm nội dung thật)
                        if b[1] > (page.rect.height * 0.5):
                            # Footnote bắt đầu bằng Số + Dấu cách + Chữ In Hoa (VD: "1 Thuật ngữ", "2 Polyakov")
                            if re.match(r'^[1-9]\s+[A-ZĐ]', block_text):
                                continue
                            # Footnote bắt đầu bằng dấu mũ nhỏ (VD: "¹ Thuật ngữ")
                            if re.match(r'^[¹²³⁴⁵⁶⁷⁸⁹⁰]', block_text):
                                continue
                                
                        # Phân loại cột Trái/Phải
                        if b[0] < mid_point:
                            left_col.append(b)
                        else:
                            right_col.append(b)
                            
                # Sắp xếp từ trên xuống dưới
                left_col.sort(key=lambda b: b[1])
                right_col.sort(key=lambda b: b[1])
                
                # Đọc hết cột trái rồi mới sang cột phải
                for b in left_col + right_col:
                    text += b[4].strip() + "\n"
    except Exception as e:
        logging.error(f"Lỗi fitz khi đọc file: {e}")
        return ""
    return text


def process_pdfs(json_path: str, output_path: str = None, max_files: int = None):
    path = Path(json_path)
    if output_path is None:
        output_path = str(path.parent / f"{path.stem}_cleaned{path.suffix}")
        
    with open(path, 'r', encoding='utf-8') as f:
        articles = json.load(f)
    
    # New structure: raw_pdfs is in data/ folder (sibling of processed/)
    data_dir = Path(__file__).parent.parent  # data/
    target_articles = [a for a in articles if a.get('pdf_path') and a.get('extraction_status') != 'success']
    
    if max_files:
        target_articles = target_articles[:max_files]
        
    success_count = empty_count = failed_count = 0

    for art in tqdm(target_articles, desc="Processing PDFs"):
        pdf_rel_path = art['pdf_path'].replace('\\', '/')
        if pdf_rel_path.startswith('raw_pdfs/'):
            pdf_path = data_dir / pdf_rel_path
        else:
            pdf_path = Path(pdf_rel_path)
            
        if not pdf_path.exists():
            art['extraction_status'] = 'failed'
            failed_count += 1
            continue
            
        # DÙNG HÀM MỚI BÓC CHỮ CHỐNG 2 CỘT
        raw_text = extract_text_2_columns(pdf_path)
        
        if not raw_text or len(raw_text.strip()) < 50:
            art['extraction_status'] = 'empty_text'
            art['content_cleaned'] = ""
            art['word_count'] = 0
            empty_count += 1
        else:
            clean_text_result = clean_vnu_text(raw_text)
            
            if clean_text_result and len(clean_text_result.strip()) > 50:
                art['extraction_status'] = 'success'
                art['content_cleaned'] = clean_text_result
                art['word_count'] = len(clean_text_result.split())
                success_count += 1
            else:
                art['extraction_status'] = 'empty_text'
                empty_count += 1

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(articles, f, ensure_ascii=False, indent=2)
        
    logging.info(f"\n[OK] Success: {success_count} | [~] Empty: {empty_count} | [X] Failed: {failed_count}")


if __name__ == "__main__":
    import sys
    import io
    
    # Fix console encoding cho Windows
    if sys.stdout.encoding != 'utf-8':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
        
    # Paths: vnu_pdf_cleaner.py is in data/processed/
    # raw_metadata is sibling folder: data/raw_metadata/
    JSON_FILE = "../raw_metadata/vnu_articles_metadata.json"
    OUTPUT_FILE = "./vnu_articles_metadata_cleaned.json"
    
    process_pdfs(JSON_FILE, output_path=OUTPUT_FILE)