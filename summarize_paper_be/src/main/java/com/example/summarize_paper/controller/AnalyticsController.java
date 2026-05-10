package com.example.summarize_paper.controller;

import com.example.summarize_paper.dto.response.ApiResponse;
import com.example.summarize_paper.dto.response.ChartDataResponse;
import com.example.summarize_paper.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/volume")
    public ApiResponse<List<ChartDataResponse>> getVolumeChart() {
        return ApiResponse.<List<ChartDataResponse>>builder()
                .data(analyticsService.getVolumeChartData())
                .build();
    }

}
