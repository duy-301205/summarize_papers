package com.example.summarize_paper.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    UNCATEGORIZED(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1000, "Uncategorized error key", HttpStatus.BAD_REQUEST),

    UNAUTHENTICATED(2001, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(2002, "You do not have permission", HttpStatus.FORBIDDEN),
    USER_NOT_FOUND(2003, "User not found", HttpStatus.NOT_FOUND),
    USER_EXISTED(2004, "User already exists", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(2005, "Email already exists", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(2006, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),

    PAPER_NOT_FOUND(3001, "Paper not found", HttpStatus.NOT_FOUND),
    INVALID_FILE_FORMAT(3002, "Only PDF files are supported", HttpStatus.BAD_REQUEST),
    FILE_TOO_LARGE(3003, "File size exceeds the 10MB limit", HttpStatus.BAD_REQUEST),
    UPLOAD_FAILED(3004, "Failed to upload file to storage", HttpStatus.INTERNAL_SERVER_ERROR),

    AI_SERVICE_UNAVAILABLE(4001, "AI Backend (FastAPI) is not responding", HttpStatus.SERVICE_UNAVAILABLE),
    SUMMARIZATION_FAILED(4002, "Failed to generate summary", HttpStatus.INTERNAL_SERVER_ERROR),
    RAG_PIPELINE_ERROR(4003, "Error during RAG context retrieval", HttpStatus.INTERNAL_SERVER_ERROR);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
