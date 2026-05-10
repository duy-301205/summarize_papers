package com.example.summarize_paper.dto.event;

import java.util.List;
import java.util.Map;

public record ChatResponse(String answer, List<Map<String, Object>> sources) {
}
