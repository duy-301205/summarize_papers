package com.example.summarize_paper.controller;

import com.example.summarize_paper.dto.event.ChatRequest;
import com.example.summarize_paper.dto.event.ChatResponse;
import com.example.summarize_paper.dto.response.ApiResponse;
import com.example.summarize_paper.dto.response.MessageResponse;
import com.example.summarize_paper.service.RagService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/history/{conversationId}")
    public ApiResponse<List<MessageResponse>> getHistory(@PathVariable Long conversationId) {
        return ApiResponse.<List<MessageResponse>>builder()
                .data(ragService.getChatHistory(conversationId))
                .build();
    }
}
