# load model embedding chính
# encode text
from langchain_huggingface import HuggingFaceEmbeddings

class E5Embedder:
    def __init__(self):
        # Bê y nguyên model khai báo của bạn vào đây
        self.embeddings = HuggingFaceEmbeddings(
            model_name="intfloat/multilingual-e5-base", 
            model_kwargs={'device': 'cpu'}
        )
    
    def get_model(self):
        return self.embeddings