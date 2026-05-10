package com.example.summarize_paper.repository;

import com.example.summarize_paper.entity.Paper;
import com.example.summarize_paper.entity.User;
import com.example.summarize_paper.enums.PaperStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
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
}
