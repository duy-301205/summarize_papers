# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.api import auth 

load_dotenv()

app = FastAPI(title="AI Service Bridge")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký các Router vào hệ thống
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])