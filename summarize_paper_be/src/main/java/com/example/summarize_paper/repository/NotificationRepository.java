package com.example.summarize_paper.repository;

import com.example.summarize_paper.entity.Notification;
import com.example.summarize_paper.enums.NotificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserEmailOrderByCreatedAtDesc(String email);

    long countByUserEmailAndStatus(String email, NotificationStatus status);

    List<Notification> findByUserEmailAndStatus(String email, NotificationStatus status);}
