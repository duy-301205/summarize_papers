package com.example.summarize_paper.dto.response;

import com.example.summarize_paper.enums.PaperStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PaperUploadResponse {
    private Long id;
    private Long userId;
    private String title;
    private Long fileSize;
    private String fileType;
    private PaperStatus status;
    private String checksum;
    private LocalDateTime createdAt;
}
