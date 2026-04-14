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
    if not raw_text: return ""

    # ===== CẤP ĐỘ 1: XÓA RÁC CƠ BẢN (Giữ cấu trúc Block \n\n) =====
    # Chúng ta tách văn bản theo từng đoạn (block) để việc chặt đầu an toàn hơn
    blocks = raw_text.split('\n\n')
    cleaned_blocks = []
    for block in blocks:
        lines = block.split('\n')
        valid_lines = []
        for line in lines:
            line_strip = line.strip()
            if line_strip.isdigit() and len(line_strip) <= 3: continue
            if any(x in line for x in ["Tạp chí Khoa học ĐHQGHN", "VNU Journal of Science", "J. Sci. ĐHQGHN"]): continue
            if re.match(r'^\s*[-─═_]+\s*$', line_strip): continue
            if line_strip:
                valid_lines.append(line_strip)
        if valid_lines:
            cleaned_blocks.append('\n'.join(valid_lines))
    
    text = '\n\n'.join(cleaned_blocks)

    # ===== CẤP ĐỘ 2: CHẶT ĐẦU (SMART CHOPPER V4 - BLOCK AWARE) =====
    # Quét trong 3000 ký tự đầu, thứ tự ưu tiên cực kỳ chặt chẽ
    search_zone = text[:3000]
    start_idx = 0

    # Ưu tiên 1: Chém chính xác vào các biến thể (Thêm "Lời mở đầu" của Kolotov)
    match_1_exact = re.search(r'(^|\n)1\.\s+(Mở\s*đầu|Lời\s*mở\s*đầu|Đặt\s*vấn\s*đề|Giới\s*thiệu|Tổng\s*quan)', search_zone, flags=re.IGNORECASE)
    
    # Ưu tiên 2: Chém vào Mục 1. bất kỳ (VD: 1. Khái niệm, 1. Cơ sở lý luận...)
    match_1_any = re.search(r'(^|\n)1\.\s+[A-ZĐÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝĂĐĨŨƠƯẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴỶỸ]', search_zone)
    
    # Ưu tiên 3: Chém sau Từ khóa
    match_kw = re.search(r'(^|\n)(Từ\s*khóa|Từ\s*khoá|Keywords?)\s*[:：]', search_zone, flags=re.IGNORECASE)
    
    # Ưu tiên 4: Chém sau Tóm tắt (Trị "Ca đột biến" bài Tự kỷ & bài Fukuzawa)
    match_abs = re.search(r'(^|\n)(Tóm\s*tắt|Tóiti\s*tắt|Abstract)\s*[:.]', search_zone, flags=re.IGNORECASE)

    if match_1_exact:
        start_idx = match_1_exact.start() if search_zone[match_1_exact.start()] != '\n' else match_1_exact.start() + 1
    elif match_1_any:
        start_idx = match_1_any.start() if search_zone[match_1_any.start()] != '\n' else match_1_any.start() + 1
    elif match_kw:
        # Nhảy qua hết đoạn Từ khóa (Đến dấu \n\n tiếp theo)
        next_double_newline = search_zone.find('\n\n', match_kw.end())
        if next_double_newline != -1:
            start_idx = next_double_newline + 2
        else:
            next_newline = search_zone.find('\n', match_kw.end())
            start_idx = next_newline + 1 if next_newline != -1 else match_kw.end()
    elif match_abs:
        # Nhảy qua hết đoạn Tóm tắt
        next_double_newline = search_zone.find('\n\n', match_abs.end())
        if next_double_newline != -1:
            start_idx = next_double_newline + 2
        else:
            next_newline = search_zone.find('\n', match_abs.end())
            start_idx = next_newline + 1 if next_newline != -1 else match_abs.end()

    # Bổ nhát dao cuối cùng để dọn sạch phần rác bên trên
    text = text[start_idx:].strip()

    # ===== CẤP ĐỘ 3: CẮT ĐUÔI =====
    tail_patterns = [r'(^|\n)Tài\s*liệu\s*tham\s*khảo', r'(^|\n)TÀI\s*LIỆU\s*THAM\s*KHẢO', r'(^|\n)References?']
    for pattern in tail_patterns:
        split_result = re.split(pattern, text, maxsplit=1, flags=re.IGNORECASE)
        if len(split_result) > 1:
            text = split_result[0]
            break

    # ===== CẤP ĐỘ 4: CHUẨN HÓA VÀ NỐI CÂU =====
    text = re.sub(r'\[\d+[^\]]*\]', '', text) # Xóa trích dẫn [1]
    text = re.sub(r'-\s*\n\s*', '', text)     # Nối từ gãy khi xuống dòng
    # Chỉ nối các dòng không kết thúc bằng dấu chấm/phẩy, giúp giữ nguyên mạch văn
    text = re.sub(r'(?<![.!?;:\)\'\"])\n+', ' ', text) 
    
    text = re.sub(r'[ \t]+', ' ', text)
    text = unicodedata.normalize('NFC', text)

    # ===== CẤP ĐỘ 5: TỪ ĐIỂN SỬA LỖI OCR/FONT =====
    text = text.replace("ỉ 0", "10")
    text = text.replace("Tóiti tắt", "Tóm tắt")
    text = text.replace("chan đoán", "chẩn đoán")
    text = text.replace("frè", "trẻ") 
    text = text.replace("ữẻ", "trẻ")
    text = text.replace("ừong", "trong")
    text = text.replace("ưên", "trên")

    return text.strip()


def extract_text_2_columns(pdf_path: Path) -> str:
    """Lõi bóc tách KHÔNG GIAN: Dò tìm thông minh Tóm tắt đầu/cuối bài dựa trên layout 2 cột"""
    text = ""
    try:
        with fitz.open(pdf_path) as doc:
            for page_num, page in enumerate(doc):
                page_height = page.rect.height
                mid_point = page.rect.width / 2

                words = page.get_text("words")
                blocks_dict = {}
                for w in words:
                    block_no, line_no = w[5], w[6]
                    if block_no not in blocks_dict: blocks_dict[block_no] = {}
                    if line_no not in blocks_dict[block_no]: blocks_dict[block_no][line_no] = []
                    blocks_dict[block_no][line_no].append(w)

                top_full_text = ""
                bottom_full_text = ""
                left_text = ""
                right_text = ""

                for block_no in sorted(blocks_dict.keys()):
                    lines = blocks_dict[block_no]
                    left_part = right_part = top_full_part = bottom_full_part = ""

                    for line_no in sorted(lines.keys()):
                        line_words = sorted(lines[line_no], key=lambda x: x[0])
                        if not line_words: continue

                        line_str = " ".join(w[4] for w in line_words).strip()
                        y0_line = line_words[0][1]

                        # --- LỌC RÁC CƠ BẢN ---
                        if not line_str: continue
                        if "Email:" in line_str or "@vnu.edu" in line_str or "@gmail" in line_str: continue
                        if re.match(r'^[-─═_]+$', line_str): continue
                        
                        words_only = [w[4] for w in line_words]
                        if len(words_only) > 5:
                            single_chars = sum(1 for w in words_only if len(w) == 1 and w.isalpha())
                            if single_chars / len(words_only) > 0.4: continue
                                
                        if y0_line > (page_height * 0.5):
                            if re.match(r'^[1-9]\s+[A-ZĐ]', line_str): continue
                            if re.match(r'^[¹²³⁴⁵⁶⁷⁸⁹⁰\*]', line_str): continue
                            if "Tác giả liên hệ" in line_str or "ĐT:" in line_str: continue

                        # --- DÒ TÌM VÀ CHẺ DÍNH CỘT ---
                        is_merged, split_idx = False, -1
                        for i in range(len(line_words) - 1):
                            gap = line_words[i+1][0] - line_words[i][2]
                            if gap > 15 and line_words[i][2] < (mid_point + 15) and line_words[i+1][0] > (mid_point - 15):
                                is_merged, split_idx = True, i
                                break

                        if is_merged:
                            left_part += " ".join(w[4] for w in line_words[:split_idx+1]) + "\n"
                            right_part += " ".join(w[4] for w in line_words[split_idx+1:]) + "\n"
                        else:
                            # --- PHÂN LOẠI KHÔNG GIAN BỐ CỤC ---
                            line_x0, line_x1 = line_words[0][0], line_words[-1][2]
                            if line_x1 <= mid_point + 30: left_part += line_str + "\n"
                            elif line_x0 >= mid_point - 30: right_part += line_str + "\n"
                            else: 
                                # Nếu trải dài ngang, chia làm Nửa trên và Nửa dưới
                                if y0_line < page_height * 0.4:
                                    top_full_part += line_str + "\n"
                                else:
                                    bottom_full_part += line_str + "\n"

                    if top_full_part: top_full_text += top_full_part.strip() + "\n\n"
                    if bottom_full_part: bottom_full_text += bottom_full_part.strip() + "\n\n"
                    if left_part: left_text += left_part.strip() + "\n\n"
                    if right_part: right_text += right_part.strip() + "\n\n"

                # ===== VŨ KHÍ TỐI THƯỢNG: TRẢM TÓM TẮT TRANG ĐẦU =====
                if page_num == 0:
                    # Nếu bài báo có Cột Trái / Cột Phải rõ ràng (dài hơn 50 ký tự)
                    # Chứng tỏ đây là báo 2 cột. Khối trải ngang ở trên chắc chắn là Tóm tắt rác -> Đốt!
                    if len(left_text) > 50 or len(right_text) > 50:
                        top_full_text = ""
                        
                # ===== CHUẨN HÓA THỨ TỰ LẮP RÁP =====
                if top_full_text: text += top_full_text
                if left_text: text += left_text
                if right_text: text += right_text
                if bottom_full_text: text += bottom_full_text # Đẩy Abstract Tiếng Anh xuống sau cùng để bị chém!
                
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