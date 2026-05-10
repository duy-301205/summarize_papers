package com.example.summarize_paper.service;

import com.example.summarize_paper.dto.response.ChartDataResponse;
import com.example.summarize_paper.dto.response.DashboardStatsResponse;
import com.example.summarize_paper.enums.PaperStatus;
import com.example.summarize_paper.repository.PaperRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    private final PaperRepository paperRepository;
    private final UserService userService;

    public List<ChartDataResponse> getVolumeChartData() {
        Long userId = userService.getCurrentUser().getId();

        List<Object[]> rawData = paperRepository.countPapersByMonthNative(userId);

        return rawData.stream()
                .map(row -> new ChartDataResponse(
                        row[0].toString(),
                        ((Number) row[1]).longValue()
                ))
                .collect(Collectors.toList());
    }

    public List<ChartDataResponse> getTopicsChartData() {
        Long userId = userService.getCurrentUser().getId();

        List<Object[]> rawData = paperRepository.countPapersByJournalNative(userId);

        return rawData.stream()
                .map(row -> ChartDataResponse.builder()
                        .label(row[0].toString())
                        .value(((Number) row[1]).longValue())
                        .build())
                .collect(Collectors.toList());
    }

    public DashboardStatsResponse getSummaryStats() {
        Long userId = userService.getCurrentUser().getId();

        // 1. Articles Processed: Tổng số bài báo
        long total = paperRepository.countByUserId(userId);

        // 2. Accuracy Score: Tính dựa trên số bài đã hoàn thành (DONE)
        long doneCount = paperRepository.countByUserIdAndStatus(userId, PaperStatus.DONE);
        double accuracy = total > 0 ? (double) doneCount / total * 100 : 0;

        // 3. Tokens Consumed: Giả lập (Ví dụ mỗi bài trung bình 25.5k tokens)
        double totalTokens = total * 25.5;

        return DashboardStatsResponse.builder()
                .totalArticles(total)
                .avgTime("85.2s")
                .tokensConsumed(String.format("%.1fk", totalTokens))
                .accuracyScore(String.format("%.1f%%", accuracy))
                .build();
    }
}
