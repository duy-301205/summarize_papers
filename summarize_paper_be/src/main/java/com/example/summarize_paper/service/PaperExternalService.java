package com.example.summarize_paper.service;

import com.example.summarize_paper.dto.event.PaperEmbeddingEvent;
import com.example.summarize_paper.dto.event.PaperSummaryEvent;
import com.example.summarize_paper.dto.event.PaperUploadEvent;
import com.example.summarize_paper.entity.Paper;
import com.example.summarize_paper.repository.PaperRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaperExternalService {

    @Value("${app.fastapi.url}")
    private String fastapiUrl;

    private final RestTemplate restTemplate;
    private final PaperRepository paperRepository;
    private final SseService sseService;

    @Async // Chạy ngầm để không treo request upload
    public void handleFullPaperAnalysisWorkflow(Long paperId) {
        log.info("🏁 Bắt đầu quy trình xử lý BẤT ĐỒNG BỘ (SSE) cho Paper ID: {}", paperId);

        try {
            // Bước 1: Trích xuất
            sseService.sendStatus(paperId, "Đang trích xuất Metadata...", 20);
            log.info("🔗 Bước 1: Gọi FastAPI Trích xuất Metadata...");
            String extractUrl = fastapiUrl + "/api/papers/process";
            restTemplate.postForEntity(extractUrl, new HttpEntity<>(Map.of("paper_id", paperId), createHeaders()), String.class);

            // Bước 2: Embedding
            sseService.sendStatus(paperId, "Đang thực hiện Embedding tài liệu...", 50);
            log.info("🚀 Bước 2: Gọi FastAPI Embedding cho Paper ID: {}", paperId);
            String embeddingUrl = fastapiUrl + "/api/papers/embedding/process";
            restTemplate.postForEntity(embeddingUrl, new HttpEntity<>(Map.of("paper_id", paperId), createHeaders()), String.class);

            // Bước 3: Tóm tắt
            sseService.sendStatus(paperId, "Đang khởi chạy AI tóm tắt nội dung...", 80);
            log.info("📝 Bước 3: Khởi chạy Tóm tắt AI cho Paper ID: {}", paperId);
            Paper paper = paperRepository.findById(paperId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Paper ID: " + paperId));

            String summaryUrl = fastapiUrl + "/api/papers/summarize/" + paperId + "?user_id=" + paper.getUser().getId();
            ResponseEntity<Map> summaryRes = restTemplate.postForEntity(summaryUrl, new HttpEntity<>(createHeaders()), Map.class);

            if (summaryRes.getStatusCode().is2xxSuccessful()) {
                log.info("🎉 TẤT CẢ QUY TRÌNH HOÀN TẤT! Paper ID {} đã có kết quả.", paperId);
                sseService.sendStatus(paperId, "Phân tích hoàn tất! Đang chuyển trang...", 100);
            }
        } catch (Exception e) {
            log.error("❌ Pipeline bị sụp đổ tại ID {}: {}", paperId, e.getMessage());
            // Gửi mã -1 hoặc thông báo lỗi về cho giao diện
            sseService.sendStatus(paperId, "Lỗi xử lý: " + e.getMessage(), -1);
        }
    }

    // Hàm phụ trợ tạo headers cho gọn code
    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }
}
