package com.metricon.notification.service;

import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.metricon.common.enums.NotificationType;
import com.metricon.notification.dto.NotificationResponse;
import com.metricon.notification.entity.Notification;
import com.metricon.notification.repository.NotificationRepository;
import com.metricon.user.entity.User;
import com.metricon.user.repository.UserRepository;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationServiceImpl(NotificationRepository notificationRepository,
                                   UserRepository userRepository,
                                   SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public List<NotificationResponse> getMyNotifications(String email) {
        User user = getUserByEmail(email);
        return notificationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public void markAsRead(Long notificationId, String email) {
        User user = getUserByEmail(email);
        Notification notification = notificationRepository.findByIdAndUser(notificationId, user)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead(String email) {
        User user = getUserByEmail(email);
        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    @Override
    public void createNotification(String userEmail, String title, String message, NotificationType type) {
        userRepository.findByEmail(userEmail).ifPresent(user -> {
            Notification notification = new Notification();
            notification.setUser(user);
            notification.setTitle(title);
            notification.setMessage(message);
            notification.setType(type);

            Notification saved = notificationRepository.save(notification);
            NotificationResponse dto = mapToDto(saved);
            messagingTemplate.convertAndSendToUser(
                    userEmail,
                    "/queue/notifications",
                    dto
            );
        });
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    private NotificationResponse mapToDto(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getTitle(),
                n.getMessage(),
                n.getType().name(),
                n.isRead(),
                n.getCreatedAt()
        );
    }
}