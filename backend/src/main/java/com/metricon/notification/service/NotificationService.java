package com.metricon.notification.service;

import java.util.List;

import com.metricon.common.enums.NotificationType;
import com.metricon.common.enums.RoleName;
import com.metricon.notification.dto.NotificationResponse;

public interface NotificationService {
    List<NotificationResponse> getMyNotifications(String email);
    void markAsRead(Long notificationId, String email);
    void markAllAsRead(String email);
    void createNotification(String userEmail, String title, String message, NotificationType type);
    void createNotificationForRole(RoleName roleName, String title, String message, NotificationType type);
}