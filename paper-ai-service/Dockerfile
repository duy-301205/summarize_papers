# Sử dụng Python bản slim để nhẹ dung lượng image
FROM python:3.10-slim

# Cài đặt các thư viện hệ thống cần thiết cho một số thư viện PDF hoặc NumPy
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép file yêu cầu và cài đặt thư viện trước để tận dụng cache của Docker
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# TẠO THƯ MỤC STORAGE (Quan trọng để khớp với Volume trong Docker Compose)
RUN mkdir -p /app/storage/papers && chmod 777 /app/storage/papers

# Chạy ứng dụng bằng uvicorn
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]