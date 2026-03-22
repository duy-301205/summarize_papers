CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       username VARCHAR(50) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       institution VARCHAR(255),
                       avatar_url VARCHAR(500),
                       role VARCHAR(20) DEFAULT 'ROLE_USER',
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. BẢNG PAPERS (Quản lý Metadata bài báo)

CREATE TABLE papers (
                        id BIGSERIAL PRIMARY KEY,
                        title VARCHAR(255) NOT NULL,
                        file_path VARCHAR(500) NOT NULL,
                        file_size BIGINT,
                        status VARCHAR(20) DEFAULT 'UPLOADED',
                        user_id BIGINT NOT NULL,
                        upload_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Ràng buộc khóa ngoại: Xóa user thì xóa luôn papers của user đó
                        CONSTRAINT fk_paper_user
                            FOREIGN KEY (user_id)
                                REFERENCES users(id)
                                ON DELETE CASCADE
);

-- 3. BẢNG SUMMARIES (Lưu lịch sử tóm tắt từ AI)

CREATE TABLE summaries (
                           id BIGSERIAL PRIMARY KEY,
                           paper_id BIGINT NOT NULL,
                           content TEXT NOT NULL,
                           method VARCHAR(50) DEFAULT 'RAG',
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Ràng buộc khóa ngoại: Xóa paper thì xóa luôn bản tóm tắt liên quan
                           CONSTRAINT fk_summary_paper
                               FOREIGN KEY (paper_id)
                                   REFERENCES papers(id)
                                   ON DELETE CASCADE
);

-- 4. INDEXES (Tối ưu hóa truy vấn)
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_papers_user_id ON papers(user_id);
CREATE INDEX idx_summaries_paper_id ON summaries(paper_id);