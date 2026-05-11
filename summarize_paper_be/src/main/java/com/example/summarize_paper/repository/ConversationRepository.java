package com.example.summarize_paper.repository;

import com.example.summarize_paper.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findByUserIdAndPaperIdOrderByCreatedAtDesc(Long userId, Long paperId);
}
