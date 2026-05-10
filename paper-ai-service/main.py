# Khởi tạo FastAPI app
# Đăng ký toàn bộ routes
# Khởi tạo global components (DB, model, logger)

from fastapi import FastAPI
from app.api.routes import extract,embedding, summarize

app = FastAPI()

app.include_router(
    extract.router, 
    prefix="/api/papers", 
    tags=["Papers"])

app.include_router(
    embedding.router, 
    prefix="/api/papers/embedding", 
    tags=["Vector Processing"]
)

app.include_router(
    summarize.router, 
    prefix="/api/papers", 
    tags=["Analysis"]
)