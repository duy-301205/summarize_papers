# chia đoạn thông minh
from langchain_text_splitters import RecursiveCharacterTextSplitter

class TextChunker:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", r"(?<=\. )", " ", ""],
            is_separator_regex=True,
        )

    def split_text(self, text_content: str):
        """Băm văn bản dài thành các mẩu nhỏ"""
        return self.text_splitter.split_text(text_content)
