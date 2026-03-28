CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       username VARCHAR(50) NOT NULL UNIQUE ,
                       password VARCHAR(255) NOT NULL,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       institution VARCHAR(255),
                       avatar_url VARCHAR(500),
                       role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE papers (
                        id BIGSERIAL PRIMARY KEY,
                        user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
                        title VARCHAR(255),
                        file_path VARCHAR(500),
                        file_size BIGINT,
                        file_type VARCHAR(20),
                        status VARCHAR(20) DEFAULT 'UPLOADED'
                            CHECK (status IN ('UPLOADED', 'PROCESSING', 'DONE', 'FAILED')),
                        checksum VARCHAR(255),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversations (
                               id BIGSERIAL PRIMARY KEY,
                               user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
                               paper_id BIGINT REFERENCES papers(id) ON DELETE SET NULL,
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_messages (
                               id BIGSERIAL PRIMARY KEY,
                               conversation_id BIGINT REFERENCES conversations(id) ON DELETE CASCADE,
                               role VARCHAR(20) NOT NULL
                                   CHECK (role IN ('user', 'assistant', 'system')),
                               content TEXT,
                               source_nodes JSONB,
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analysis_sessions (
                                   id BIGSERIAL PRIMARY KEY,
                                   paper_id BIGINT REFERENCES papers(id) ON DELETE CASCADE,
                                   user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
                                   prompt TEXT,
                                   model_name VARCHAR(100),

                                   status VARCHAR(20) DEFAULT 'PENDING'
                                       CHECK (status IN ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED')),
                                   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analysis (
                          id BIGSERIAL PRIMARY KEY,
                          session_id BIGINT REFERENCES analysis_sessions(id) ON DELETE CASCADE,
                          type VARCHAR(50) NOT NULL
                              CHECK (type IN ('SUMMARY', 'KEYWORDS', 'HIGHLIGHT')),
                          content TEXT NOT NULL,
                          status VARCHAR(20) DEFAULT 'PENDING'
                              CHECK (status IN ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED')),
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE paper_metadata (
                                id BIGSERIAL PRIMARY KEY,
                                paper_id BIGINT REFERENCES papers(id) ON DELETE CASCADE,
                                authors TEXT,
                                publication_year INT,
                                keywords TEXT,
                                doi VARCHAR(100),
                                journal VARCHAR(255),
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE paper_chunks (
                              id BIGSERIAL PRIMARY KEY,
                              paper_id BIGINT REFERENCES papers(id) ON DELETE CASCADE,
                              content TEXT NOT NULL ,
                              embedding VECTOR(1536) NOT NULL,
                              page_number INT CHECK (page_number >= 0),
                              chunk_index INT NOT NULL CHECK (chunk_index >= 0),
                              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              UNIQUE (paper_id, chunk_index)
);

CREATE TABLE notifications (
                               id BIGSERIAL PRIMARY KEY,
                               user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
                               message TEXT,
                               type VARCHAR(50) CHECK (type IN ('INFO', 'WARNING', 'ERROR')),
                               status VARCHAR(20) CHECK (status IN ('UNREAD', 'READ')),
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invalidated_tokens (
                                    id VARCHAR(255) PRIMARY KEY, -- JTI (JWT ID) của token
                                    expiry_time TIMESTAMP NOT NULL,
                                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_papers_user_id ON papers(user_id);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX idx_analysis_sessions_user_id ON analysis_sessions(user_id);
CREATE INDEX idx_analysis_session_id ON analysis(session_id);
CREATE INDEX idx_paper_chunks_paper_id ON paper_chunks(paper_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;

CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_papers_updated_at ON papers;

CREATE TRIGGER trigger_papers_updated_at
    BEFORE UPDATE ON papers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_paper_chunks_embedding
    ON paper_chunks
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);
