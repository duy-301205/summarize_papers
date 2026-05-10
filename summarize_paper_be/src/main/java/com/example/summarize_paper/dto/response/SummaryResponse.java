package com.example.summarize_paper.dto.response;

import com.example.summarize_paper.enums.AnalysisStatus;
import com.example.summarize_paper.enums.AnalysisType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class SummaryResponse {
    private Long sessionId;
    private AnalysisType type;
    private String content;
    private AnalysisStatus status;
    private LocalDateTime createdAt;
}
