package com.example.summarize_paper.service;

import com.example.summarize_paper.dto.response.ChartDataResponse;
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
}
