# 📄 Summarize Papers – Research Paper Summarization System

## 📌 Giới thiệu

**Summarize Papers** là một hệ thống hỗ trợ **tóm tắt tự động các bài báo khoa học** bằng các kỹ thuật **Natural Language Processing (NLP)** và **Machine Learning**.

Hệ thống cho phép người dùng:

* Upload bài báo khoa học dạng **PDF**
* Trích xuất nội dung văn bản từ bài báo
* Tự động **tóm tắt nội dung chính của bài báo**
* Tìm kiếm thông tin quan trọng trong bài báo

Dự án được xây dựng trong khuôn khổ môn **Khai phá dữ liệu (Data Mining)** với mục tiêu áp dụng các kỹ thuật hiện đại như:

* **Abstractive Text Summarization**
* **Transformer-based Models**
* **Retrieval-Augmented Generation (RAG)**
* **Vector Search**

---

# 🧠 Ý tưởng hệ thống

Các bài báo khoa học thường rất dài (10–30 trang), khiến việc đọc và nắm bắt nội dung chính trở nên tốn thời gian.

Hệ thống **Summarize Papers** giúp giải quyết vấn đề này bằng cách:

1. Trích xuất nội dung từ file PDF.
2. Chia văn bản thành các đoạn nhỏ (text chunks).
3. Tạo **vector embedding** cho các đoạn văn.
4. Sử dụng **RAG pipeline** để tìm các đoạn quan trọng.
5. Áp dụng mô hình **summarization** để tạo bản tóm tắt.

Kết quả là người dùng có thể nhanh chóng hiểu:

* mục tiêu nghiên cứu
* phương pháp
* kết quả
* đóng góp của bài báo

---

# 🏗 Kiến trúc hệ thống

Hệ thống được xây dựng theo kiến trúc **Frontend – CMS Backend – AI Backend**.

```
Users
   │
   ▼
React Frontend
   │
   ├───────────────┐
   │               │
   ▼               ▼
Drupal CMS API     FastAPI AI API
(User / Auth /     (Summarization
 Paper Management)   + RAG Pipeline)
   │               │
   ▼               ▼
PostgreSQL        Vector Database
(metadata)        (FAISS / Chroma)
```

### Thành phần chính

**React Frontend**

* Giao diện người dùng
* Upload paper PDF
* Hiển thị bản tóm tắt
* Tìm kiếm và xem lịch sử paper

**Drupal CMS Backend**

* Quản lý người dùng
* Quản lý paper
* Lưu metadata và file
* Cung cấp API cho frontend

**FastAPI AI Backend**

* Xử lý NLP
* Chạy mô hình tóm tắt
* Thực hiện pipeline RAG
* Sinh bản tóm tắt từ bài báo

**Vector Database**

* Lưu trữ embedding của các đoạn văn
* Phục vụ semantic search cho RAG

---

# ⚙️ Công nghệ sử dụng

### Frontend

* React
* Vite
* Axios

### Backend CMS

* Drupal
* PHP
* PostgreSQL

### AI Backend

* FastAPI
* Python
* HuggingFace Transformers
* Sentence Transformers

### NLP & Machine Learning

* BART
* T5
* ViT5
* BARTpho

### RAG & Vector Search

* FAISS
* Chroma
* Embedding Models

---

# 🔬 Pipeline xử lý

Quy trình xử lý của hệ thống:

```
Upload Paper
      ↓
PDF Parsing
      ↓
Text Cleaning
      ↓
Chunking
      ↓
Embedding Generation
      ↓
Vector Database
      ↓
RAG Retrieval
      ↓
Summarization Model
      ↓
Generate Summary
```

---

# 📊 Đánh giá mô hình

Chất lượng mô hình tóm tắt được đánh giá bằng các chỉ số:

* **ROUGE-1**
* **ROUGE-2**
* **ROUGE-L**

Các chỉ số này đo mức độ tương đồng giữa:

* **generated summary** (bản tóm tắt do mô hình tạo ra)
* **reference summary** (bản tóm tắt chuẩn trong dataset)

---

# 📂 Cấu trúc project

Project được chia thành 3 phần chính:

```
summarize-papers/
│
├── frontend-react/
│
├── drupal-backend/
│
└── ai-service-fastapi/
```

* **frontend-react**: giao diện người dùng
* **drupal-backend**: CMS quản lý user và paper
* **ai-service-fastapi**: hệ thống AI tóm tắt

---

# 🎯 Mục tiêu của dự án

* Áp dụng các kỹ thuật **Khai phá dữ liệu và NLP**
* Xây dựng hệ thống **automatic paper summarization**
* Triển khai pipeline **RAG cho tài liệu dài**
* So sánh hiệu quả các mô hình **summarization**

---

# 👨‍💻 Nhóm thực hiện

Project được thực hiện bởi nhóm sinh viên trong môn **Khai phá dữ liệu**.

---

