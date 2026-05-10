# parse text từ raw
import fitz
import re
import logging
from pathlib import Path

class PDFParser:
    @staticmethod
    def extract_text_2_columns(pdf_path: str | Path) -> list[str]:
        pages_content = []
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

                            # --- GIỮ NGUYÊN LOGIC LỌC RÁC CỦA BẠN ---
                            if not line_str: continue
                            if "Email:" in line_str or "@vnu.edu" in line_str or "@gmail" in line_str: continue
                            if re.match(r'^[-─═_]+$', line_str): continue
                        
                            # --- LOGIC CHẺ CỘT (Giữ nguyên) ---
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
                                line_x0, line_x1 = line_words[0][0], line_words[-1][2]
                                if line_x1 <= mid_point + 30: left_part += line_str + "\n"
                                elif line_x0 >= mid_point - 30: right_part += line_str + "\n"
                                else: 
                                    if y0_line < page_height * 0.4: top_full_part += line_str + "\n"
                                    else: bottom_full_part += line_str + "\n"

                        if top_full_part: top_full_text += top_full_part.strip() + "\n\n"
                        if bottom_full_part: bottom_full_text += bottom_full_part.strip() + "\n\n"
                        if left_part: left_text += left_part.strip() + "\n\n"
                        if right_part: right_text += right_part.strip() + "\n\n"

                    if page_num == 0 and (len(left_text) > 50 or len(right_text) > 50):
                        top_full_text = ""

                    # LẮP RÁP TEXT CỦA TRANG HIỆN TẠI
                    current_page_text = ""
                    if top_full_text: current_page_text += top_full_text
                    if left_text: current_page_text += left_text
                    if right_text: current_page_text += right_text
                    if bottom_full_text: current_page_text += bottom_full_text
                    
                    pages_content.append(current_page_text) # Thêm vào danh sách trang
                
        except Exception as e:
            logging.error(f"Lỗi fitz: {e}")
            return []
        return pages_content