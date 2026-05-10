package com.example.summarize_paper.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaperChunkResponse {
    private Long id;
    private Integer chunkIndex;
    private String content;
    private Integer pageNumber;
}
