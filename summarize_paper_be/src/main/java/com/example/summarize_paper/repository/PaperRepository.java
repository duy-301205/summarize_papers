package com.example.summarize_paper.repository;

import com.example.summarize_paper.entity.Paper;
import com.example.summarize_paper.entity.User;
import com.example.summarize_paper.enums.PaperStatus;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaperRepository extends JpaRepository<Paper, Long> {

    List<Paper> findByUser(User user);

    // Tìm các bài báo theo trạng thái
    List<Paper> findByStatus(PaperStatus status);

    Page<Paper> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    @EntityGraph(attributePaths = {"metadata"}) // Load kèm bảng metadata ngay lập tức
    Optional<Paper> findByIdAndUserId(Long paperId, Long userId);

    @Query(value = "SELECT TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*) as count " +
            "FROM papers " +
            "WHERE user_id = :userId " +
            "GROUP BY month " +
            "ORDER BY month ASC", nativeQuery = true)
    List<Object[]> countPapersByMonthNative(@Param("userId") Long userId);

    @Query(value = "SELECT " +
            "  TRIM(SPLIT_PART(COALESCE(m.journal, 'Chưa xác định'), ',', 1)) as label, " +
            "  COUNT(p.id) as value " +
            "FROM papers p " +
            "LEFT JOIN paper_metadata m ON p.id = m.paper_id " +
            "WHERE p.user_id = :userId " +
            "GROUP BY label " +
            "ORDER BY value DESC", nativeQuery = true)
    List<Object[]> countPapersByJournalNative(@Param("userId") Long userId);

    // Đếm tổng số bài của User
    long countByUserId(Long userId);

    // Đếm số bài có trạng thái DONE của User
    long countByUserIdAndStatus(Long userId, PaperStatus status);
}
