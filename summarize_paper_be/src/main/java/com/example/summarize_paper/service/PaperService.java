package com.example.summarize_paper.service;

import com.example.summarize_paper.dto.response.PaperChunkResponse;
import com.example.summarize_paper.dto.response.PaperDetailsResponse;
import com.example.summarize_paper.dto.response.SummaryResponse;
import com.example.summarize_paper.entity.*;
import com.example.summarize_paper.enums.PaperStatus;
import com.example.summarize_paper.exception.AppException;
import com.example.summarize_paper.exception.ErrorCode;
import com.example.summarize_paper.repository.AnalysisRepository;
import com.example.summarize_paper.repository.PaperChunkRepository;
import com.example.summarize_paper.repository.PaperRepository;
import io.jsonwebtoken.io.IOException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaperService {
    @Value("${app.upload.dir}")
    private String uploadDir;

    private final PaperRepository paperRepository;
    private final UserService userService;
    private final ApplicationEventPublisher eventPublisher;
    private final PaperChunkRepository paperChunkRepository;
    private final AnalysisRepository analysisRepository;
    private final PaperExternalService paperExternalService;

    @Transactional
    public Paper savePaperOnly(MultipartFile file) throws IOException, java.io.IOException {
        // 1. Lấy thông tin User hiện tại
        User currentUser = userService.getCurrentUser();

        // 2. Xử lý lưu file vật lý
        String originalFileName = file.getOriginalFilename();
        String extension = StringUtils.getFilenameExtension(originalFileName);
        String fileName = UUID.randomUUID().toString() + "." + (extension != null ? extension : "pdf");

        Path root = Paths.get(uploadDir);
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }

        Path targetPath = root.resolve(fileName);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // 3. Tạo thực thể Paper
        Paper paper = new Paper();
        paper.setUser(currentUser);
        paper.setTitle(originalFileName);
        paper.setFilePath(targetPath.toString());
        paper.setFileSize(file.getSize());
        paper.setFileType(extension != null ? extension.toUpperCase() : "PDF");
        paper.setStatus(PaperStatus.UPLOADED);

        return paperRepository.save(paper);
    }

    public PaperDetailsResponse getPaperDetails(Long paperId) {
        User currentUser = userService.getCurrentUser();

        // 2. Tìm bài báo
        Paper paper = paperRepository.findByIdAndUserId(paperId, currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.PAPER_NOT_FOUND));

        // 3. Map dữ liệu từ Entity sang DTO
        PaperMetadata metadata = paper.getMetadata();

        return PaperDetailsResponse.builder()
                .id(paper.getId())
                .title(paper.getTitle())
                .status(paper.getStatus())
                .fileSize(paper.getFileSize())
                .fileType(paper.getFileType())
                .createdAt(paper.getCreatedAt())
                .authors(metadata != null ? metadata.getAuthors() : null)
                .publicationYear(metadata != null ? metadata.getPublicationYear() : null)
                .keywords(metadata != null ? metadata.getKeywords() : null)
                .doi(metadata != null ? metadata.getDoi() : null)
                .journal(metadata != null ? metadata.getJournal() : null)
                .build();
    }

    public Page<PaperChunkResponse> getPaperChunksPaged(Long paperId, int page, int size) {
        // 1. Kiểm tra User hiện tại
        User currentUser = userService.getCurrentUser();

        // 2. Kiểm tra quyền sở hữu bài báo
        Paper paper = paperRepository.findByIdAndUserId(paperId, currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.PAPER_NOT_FOUND));

        // 3. Tạo đối tượng Pageable (Trang bắt đầu từ 0)
        Pageable pageable = PageRequest.of(page, size);

        // 4. Truy vấn dữ liệu phân trang
        Page<PaperChunk> chunkPage = paperChunkRepository.findByPaperIdOrderByChunkIndexAsc(paperId, pageable);

        // 5. Map sang Page của DTO
        return chunkPage.map(chunk -> PaperChunkResponse.builder()
                .id(chunk.getId())
                .chunkIndex(chunk.getChunkIndex())
                .content(chunk.getContent())
                .pageNumber(chunk.getPageNumber())
                .build());
    }

    public SummaryResponse getLatestSummary(Long paperId) {
        User currentUser = userService.getCurrentUser();

        paperRepository.findByIdAndUserId(paperId, currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.PAPER_NOT_FOUND));

        Analysis summary = analysisRepository.findLatestSummaryByPaperId(paperId)
                .orElseThrow(() -> new AppException(ErrorCode.SUMMARY_NOT_FOUND));

        // 4. Map sang DTO
        return SummaryResponse.builder()
                .sessionId(summary.getSession().getId())
                .type(summary.getType())
                .content(summary.getContent())
                .status(summary.getStatus())
                .createdAt(summary.getCreatedAt())
                .build();
    }

    public Resource getPaperFileAsResource(Long paperId) {
        Paper paper = paperRepository.findById(paperId)
                .orElseThrow(() -> new AppException(ErrorCode.PAPER_NOT_FOUND));

        try {
            Path path = Paths.get(paper.getFilePath());
            Resource resource = new UrlResource(path.toUri());

            if (resource.exists() || resource.isReadable()) {
                log.info(" Đang stream file PDF cho Paper ID: {} | Path: {}", paperId, paper.getFilePath());
                return resource;
            } else {
                log.error(" File không tồn tại tại đường dẫn: {}", paper.getFilePath());
                throw new AppException(ErrorCode.PAPER_NOT_FOUND);
            }
        } catch (MalformedURLException e) {
            log.error(" Lỗi định dạng đường dẫn URL file: {}", e.getMessage());
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    public Page<PaperDetailsResponse> getMyPapersPaged(int page, int size) {
        // 1. Lấy User hiện tại từ Token
        User currentUser = userService.getCurrentUser();

        Pageable pageable = PageRequest.of(page, size);

        Page<Paper> paperPage = paperRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId(), pageable);

        return paperPage.map(paper -> {
            PaperMetadata metadata = paper.getMetadata(); // Lấy metadata (có thể null)

            return PaperDetailsResponse.builder()
                    .id(paper.getId())
                    .title(paper.getTitle())
                    .status(paper.getStatus())
                    .fileSize(paper.getFileSize())
                    .fileType(paper.getFileType())
                    .createdAt(paper.getCreatedAt())
                    .authors(metadata != null ? metadata.getAuthors() : "N/A")
                    .publicationYear(metadata != null ? metadata.getPublicationYear() : null)
                    .keywords(metadata != null ? metadata.getKeywords() : "")
                    .doi(metadata != null ? metadata.getDoi() : "")
                    .journal(metadata != null ? metadata.getJournal() : "N/A")
                    .build();
        });
    }

}