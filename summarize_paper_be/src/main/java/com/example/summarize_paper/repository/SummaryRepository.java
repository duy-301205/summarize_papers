package com.example.summarize_paper.repository;

import com.example.summarize_paper.entity.Paper;
import com.example.summarize_paper.entity.Summary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SummaryRepository extends JpaRepository<Summary, Long> {

    List<Summary> findByPaper(Paper paper);
}
