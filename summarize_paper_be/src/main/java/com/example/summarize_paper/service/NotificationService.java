package com.example.summarize_paper.service;

import com.example.summarize_paper.dto.request.NotificationRequest;
import com.example.summarize_paper.dto.response.NotificationResponse;
import com.example.summarize_paper.entity.Notification;
import com.example.summarize_paper.entity.User;
import com.example.summarize_paper.enums.NotificationStatus;
import com.example.summarize_paper.repository.NotificationRepository;
import com.example.summarize_paper.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .type(notification.getType())
                .status(notification.getStatus())
                .createdAt(notification.getCreatedAt())
                .build();
    }

    public List<NotificationResponse> getMyNotifications() {
        String email = getCurrentUserEmail();
        return notificationRepository.findByUserEmailOrderByCreatedAtDesc(email)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public long getUnreadCount() {
        String email = getCurrentUserEmail();
        return notificationRepository.countByUserEmailAndStatus(email, NotificationStatus.UNREAD);
    }

    @Transactional
    public void markAsRead(Long id) {
        String email = getCurrentUserEmail();
        notificationRepository.findById(id).ifPresent(n -> {
            if (n.getUser().getEmail().equals(email)) {
                n.setStatus(NotificationStatus.READ);
                notificationRepository.save(n);
            }
        });
    }

    @Transactional
    public void markAllAsRead() {
        String email = getCurrentUserEmail();
        List<Notification> unread = notificationRepository
                .findByUserEmailAndStatus(email, NotificationStatus.UNREAD);

        unread.forEach(n -> n.setStatus(NotificationStatus.READ));
        notificationRepository.saveAll(unread);
    }

    @Transactional
    public void deleteNotification(Long id) {
        String email = getCurrentUserEmail();
        notificationRepository.findById(id).ifPresent(n -> {
            if (n.getUser().getEmail().equals(email)) {
                notificationRepository.delete(n);
            }
        });
    }

    @Transactional
    public void createNotification(NotificationRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(request.getMessage());
        notification.setType(request.getType());
        notification.setStatus(NotificationStatus.UNREAD);

        notificationRepository.save(notification);
    }
}
