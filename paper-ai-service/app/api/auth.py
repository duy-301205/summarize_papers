# app/api/auth.py
import os
import requests
from fastapi import APIRouter, HTTPException
from app.schemas.request import LoginData 

router = APIRouter()

@router.post("/login")
async def login_proxy(data: LoginData):
    token_url = os.getenv("DRUPAL_TOKEN_URL")
    payload = {
        "grant_type": "password",
        "client_id": os.getenv("DRUPAL_CLIENT_ID"),
        "client_secret": os.getenv("DRUPAL_CLIENT_SECRET"),
        "username": data.username,
        "password": data.password,
        "scope": os.getenv("DRUPAL_SCOPE")
    }
    
    try:
        response = requests.post(token_url, data=payload)
        if response.status_code == 200:
            return response.json()
        else:
            return {"status": "error", "drupal_response": response.json()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))