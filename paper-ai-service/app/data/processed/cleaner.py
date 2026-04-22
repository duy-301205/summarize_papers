# làm sạch text
import re
import unicodedata

class TextCleaner:
    @staticmethod
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
