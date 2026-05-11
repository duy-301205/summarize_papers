package com.example.summarize_paper.controller;

import com.example.summarize_paper.dto.response.*;
import com.example.summarize_paper.entity.Paper;
import com.example.summarize_paper.exception.AppException;
import com.example.summarize_paper.exception.ErrorCode;
import com.example.summarize_paper.service.PaperExternalService;
import com.example.summarize_paper.service.PaperService;
import com.example.summarize_paper.service.SseService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/papers")
@RequiredArgsConstructor
public class PaperController {
    private final PaperService paperService;
    private final SseService sseService;
    private final PaperExternalService paperExternalService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Map<String, Object>> upload(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty() || !Objects.equals(file.getContentType(), "application/pdf")) {
            throw new AppException(ErrorCode.INVALID_FILE_FORMAT);
        }

        Paper savedPaper = paperService.savePaperOnly(file);

        paperExternalService.handleFullPaperAnalysisWorkflow(savedPaper.getId());

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("paperId", savedPaper.getId());
        responseData.put("title", savedPaper.getTitle());
        responseData.put("status", "UPLOADED");

        return ApiResponse.<Map<String, Object>>builder()
                .data(responseData)
                .build();
    }

    @GetMapping(value = "/status/{paperId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribeProgress(@PathVariable Long paperId) {
        return sseService.createEmitter(paperId);
    }

    @GetMapping("/upload/{id}")
    public ApiResponse<PaperDetailsResponse> getDetails(@PathVariable("id") Long paperId) {
        return ApiResponse.<PaperDetailsResponse>builder()
                .data(paperService.getPaperDetails(paperId))
                .build();
    }

    @GetMapping("/chunks/{paperId}")
    public ApiResponse<Page<PaperChunkResponse>> getChunks(
            @PathVariable Long paperId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ApiResponse.<Page<PaperChunkResponse>>builder()
                .data(paperService.getPaperChunksPaged(paperId, page, size))
                .build();
    }

    @GetMapping("/summary/{paperId}")
    public ApiResponse<SummaryResponse> summary(@PathVariable Long paperId) {
        return ApiResponse.<SummaryResponse>builder()
                .data(paperService.getLatestSummary(paperId))
                .build();
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<Resource> viewPdf(@PathVariable Long id) {
        Resource file = paperService.getPaperFileAsResource(id);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }

    @GetMapping("/getPaper")
    public ApiResponse<Page<PaperDetailsResponse>> getMyPapers(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        Page<PaperDetailsResponse> papers = paperService.getMyPapersPaged(page, size);
        return ApiResponse.<Page<PaperDetailsResponse>>builder()
                .data(papers)
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deletePaper(@PathVariable Long id) {
        paperService.deletePaper(id);
        return ApiResponse.<String>builder()
                .code(200)
                .data("Xóa bài báo thành công")
                .build();
    }
}
