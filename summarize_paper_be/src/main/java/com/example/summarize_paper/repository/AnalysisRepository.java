package com.example.summarize_paper.repository;

import com.example.summarize_paper.entity.Analysis;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnalysisRepository extends JpaRepository<Analysis, Long> {

    @Query("SELECT a FROM Analysis a JOIN a.session s " +
            "WHERE s.paper.id = :paperId AND a.type = 'SUMMARY' " +
            "ORDER BY a.createdAt DESC")
    Optional<Analysis> findLatestSummaryByPaperId(@Param("paperId") Long paperId);
}
