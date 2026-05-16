from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import extract, embedding, summarize, rag

app = FastAPI(
    title="Paper AI Service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Paper AI Service is running"}

@app.api_route("/health", methods=["GET", "HEAD"])
def health():
    return {"status": "ok"}

app.include_router(extract.router, prefix="/api/papers", tags=["Papers"])
app.include_router(embedding.router, prefix="/api/papers/embedding", tags=["Vector Processing"])
app.include_router(summarize.router, prefix="/api/papers", tags=["Analysis"])
app.include_router(rag.router, prefix="/api/chat", tags=["Chat"])