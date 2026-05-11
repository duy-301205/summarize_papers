package com.example.summarize_paper.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class MessageResponse {
    private String role;
    private String content;
    private String sourceNodes;
    private LocalDateTime createdAt;
}
