package com.example.summarize_paper.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsResponse {
    private long totalArticles;
    private String avgTime;
    private String tokensConsumed;
    private String accuracyScore;
}
