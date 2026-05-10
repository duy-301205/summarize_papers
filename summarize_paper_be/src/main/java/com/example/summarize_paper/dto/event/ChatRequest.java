package com.example.summarize_paper.dto.event;

public record ChatRequest(Long paperId, Long conversationId, String message) {
}
