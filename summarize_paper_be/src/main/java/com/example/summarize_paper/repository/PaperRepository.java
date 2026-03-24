package com.example.summarize_paper.repository;

import com.example.summarize_paper.entity.Paper;
import com.example.summarize_paper.entity.User;
import com.example.summarize_paper.enums.PaperStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaperRepository extends JpaRepository<Paper, Long> {

    List<Paper> findByUser(User user);

    // Tìm các bài báo theo trạng thái
    List<Paper> findByStatus(PaperStatus status);
}
