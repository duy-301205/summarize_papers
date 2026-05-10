package com.example.summarize_paper.controller;

import com.example.summarize_paper.dto.event.ChatRequest;
import com.example.summarize_paper.dto.event.ChatResponse;
import com.example.summarize_paper.dto.response.ApiResponse;
import com.example.summarize_paper.service.RagService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class RagController {

    private final RagService ragService;

    @PostMapping("/ask")
    public ApiResponse<ChatResponse> ask(@RequestBody ChatRequest request) {
        return ApiResponse.<ChatResponse>builder()
                .data(ragService.askQuestion(request))
                .build();
    }
}
