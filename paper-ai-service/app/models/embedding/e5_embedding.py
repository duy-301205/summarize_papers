import os
import requests
from dotenv import load_dotenv

load_dotenv()


class E5Embedder:
    """
    Giữ nguyên tên class và các method cũ:
    - get_model()
    - embed_query()
    - embed_documents()

    Nhưng bên trong đổi từ local HuggingFaceEmbeddings sang Jina Embeddings API.
    """

    def __init__(self):
        self.api_key = os.getenv("JINA_API_KEY")
        self.model_name = os.getenv("JINA_EMBEDDING_MODEL", "jina-embeddings-v3")
        self.url = "https://api.jina.ai/v1/embeddings"

        if not self.api_key:
            raise ValueError("JINA_API_KEY is not set")

    def get_model(self):
        return self

    def embed_query(self, text: str):
        if not text or not text.strip():
            raise ValueError("Query text is empty")

        return self._embed(
            texts=[text],
            task="retrieval.query"
        )[0]

    def embed_documents(self, texts: list[str]):
        if not texts:
            return []

        for text in texts:
            if not text or not text.strip():
                raise ValueError("Document text is empty")

        return self._embed(
            texts=texts,
            task="retrieval.passage"
        )

    def _embed(self, texts: list[str], task: str):
        response = requests.post(
            self.url,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": self.model_name,
                "task": task,
                "input": texts,
            },
            timeout=120,
        )

        response.raise_for_status()

        data = response.json()

        return [item["embedding"] for item in data["data"]]