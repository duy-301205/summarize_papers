# parse text từ raw
import fitz
import re
import logging
from pathlib import Path

class PDFParser:
    @staticmethod
    def extract_text_2_columns(pdf_path: str | Path) -> str:
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