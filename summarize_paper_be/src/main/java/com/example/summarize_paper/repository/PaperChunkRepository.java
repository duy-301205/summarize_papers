package com.example.summarize_paper.repository;

import com.example.summarize_paper.entity.PaperChunk;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaperChunkRepository extends JpaRepository<PaperChunk, Long> {
    Page<PaperChunk> findByPaperIdOrderByChunkIndexAsc(Long paperId, Pageable pageable);
}
