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
    """Lõi bóc tách CHÂN LÝ: Bóc từng 'Từ' (Word), tự dò tìm và chẻ đôi các dòng bị dính cột"""
    text = ""
    try:
        with fitz.open(pdf_path) as doc:
            for page in doc:
                page_height = page.rect.height
                mid_point = page.rect.width / 2

                # Lấy từng 'TỪ' để đảm bảo KHÔNG RỤNG MỘT KÝ TỰ NÀO
                words = page.get_text("words")

                # Gom từ theo từng Block và từng Dòng (Line)
                blocks_dict = {}
                for w in words:
                    # w = (x0, y0, x1, y1, "text", block_no, line_no, word_no)
                    block_no = w[5]
                    line_no = w[6]
                    if block_no not in blocks_dict:
                        blocks_dict[block_no] = {}
                    if line_no not in blocks_dict[block_no]:
                        blocks_dict[block_no][line_no] = []
                    blocks_dict[block_no][line_no].append(w)

                full_width_text = ""
                left_text = ""
                right_text = ""

                for block_no in sorted(blocks_dict.keys()):
                    lines = blocks_dict[block_no]
                    
                    left_part = ""
                    right_part = ""
                    full_part = ""

                    for line_no in sorted(lines.keys()):
                        # Xếp các từ từ trái sang phải
                        line_words = sorted(lines[line_no], key=lambda x: x[0])
                        if not line_words: continue

                        line_str = " ".join(w[4] for w in line_words).strip()
                        y0_line = line_words[0][1]

                        # ===== 1. BỘ LỌC RÁC CƠ BẢN =====
                        if not line_str: continue
                        if "Email:" in line_str or "@vnu.edu" in line_str or "@gmail" in line_str: continue
                        if re.match(r'^[-─═_]+$', line_str): continue
                        
                        # Lọc rác lỗi font (Dòng chữ "v đ n h c T n b...")
                        words_only = [w[4] for w in line_words]
                        if len(words_only) > 5:
                            single_chars = sum(1 for w in words_only if len(w) == 1 and w.isalpha())
                            if single_chars / len(words_only) > 0.4:
                                continue
                                
                        # Lọc Footnote (Chỉ bắn tỉa ở nửa dưới trang)
                        if y0_line > (page_height * 0.5):
                            if re.match(r'^[1-9]\s+[A-ZĐ]', line_str): continue
                            if re.match(r'^[¹²³⁴⁵⁶⁷⁸⁹⁰\*]', line_str): continue
                            if "Tác giả liên hệ" in line_str or "ĐT:" in line_str: continue

                        # ===== 2. RA-ĐA CHỐNG DÍNH CỘT KINH ĐIỂN =====
                        is_merged = False
                        split_idx = -1
                        
                        # Quét khoảng cách giữa các từ cạnh nhau
                        for i in range(len(line_words) - 1):
                            current_word_x1 = line_words[i][2]
                            next_word_x0 = line_words[i+1][0]
                            gap = next_word_x0 - current_word_x1
                            
                            # Cảnh báo: Khoảng trống > 15 pixel VÀ vắt ngang qua trục giữa -> Đích thị là dính cột!
                            if gap > 15 and current_word_x1 < (mid_point + 15) and next_word_x0 > (mid_point - 15):
                                is_merged = True
                                split_idx = i
                                break

                        if is_merged:
                            # Cầm dao chẻ ngay khe hở: Trái về trái, Phải về phải
                            left_str = " ".join(w[4] for w in line_words[:split_idx+1])
                            right_str = " ".join(w[4] for w in line_words[split_idx+1:])
                            left_part += left_str + "\n"
                            right_part += right_str + "\n"
                        else:
                            # Không bị dính, phân loại theo vị trí bình thường
                            line_x0 = line_words[0][0]
                            line_x1 = line_words[-1][2]

                            if line_x1 <= mid_point + 30: # Cột trái
                                left_part += line_str + "\n"
                            elif line_x0 >= mid_point - 30: # Cột phải
                                right_part += line_str + "\n"
                            else: # Trải dài ngang trang (Tóm tắt, Tiêu đề)
                                full_part += line_str + "\n"

                    # Dồn văn bản theo giỏ
                    if full_part: full_width_text += full_part.strip() + "\n\n"
                    if left_part: left_text += left_part.strip() + "\n\n"
                    if right_part: right_text += right_part.strip() + "\n\n"

                # Lắp ráp trang: Đọc Tóm tắt -> đọc hết cột trái -> đọc hết cột phải
                if full_width_text: text += full_width_text
                if left_text: text += left_text
                if right_text: text += right_text
                
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