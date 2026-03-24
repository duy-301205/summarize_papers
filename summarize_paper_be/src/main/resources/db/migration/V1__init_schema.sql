CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       full_name VARCHAR(100), -- Thêm để hiện tên thật
                       institution VARCHAR(255),
                       avatar_url VARCHAR(500),
                       role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE papers (
                        id BIGSERIAL PRIMARY KEY,
                        title VARCHAR(255) NOT NULL,
                        content_text TEXT, -- Lưu text thô sau khi parse để dùng lại
                        file_path VARCHAR(500) NOT NULL,
                        file_size BIGINT,
                        status VARCHAR(20) DEFAULT 'PROCESSING',
                        user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                        upload_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analysis (
                          id BIGSERIAL PRIMARY KEY,
                          paper_id BIGINT NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
                          user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                          summary_title VARCHAR(255), -- Tiêu đề bản tóm tắt
                          content TEXT NOT NULL,
                          method VARCHAR(50), -- VD: Short, Detailed
                          status VARCHAR(20) DEFAULT 'COMPLETED',
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
                               id BIGSERIAL PRIMARY KEY,
                               user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                               message TEXT,
                               type VARCHAR(50),
                               is_read BOOLEAN DEFAULT FALSE,
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invalidated_tokens (
                                    id VARCHAR(255) PRIMARY KEY, -- JTI (JWT ID) của token
                                    expiry_time TIMESTAMP NOT NULL,
                                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);