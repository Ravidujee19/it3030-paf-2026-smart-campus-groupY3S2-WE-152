package com.metricon.notification.service;

import java.util.List;

import com.metricon.notification.dto.NotificationResponse;

public interface NotificationService {
    List<NotificationResponse> getMyNotifications(String email);
    void markAsRead(Long notificationId, String email);
    void markAllAsRead(String email);
}