package com.example.summarize_paper.dto.response;

import com.example.summarize_paper.enums.PaperStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PaperDetailsResponse {

    private Long id;
    private String title;
    private PaperStatus status;
    private Long fileSize;
    private String fileType;
    private LocalDateTime createdAt;

    private String authors;
    private Integer publicationYear;
    private String keywords;
    private String doi;
    private String journal;
}
