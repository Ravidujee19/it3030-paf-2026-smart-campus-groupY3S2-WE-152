package com.metricon.notification.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.metricon.notification.dto.NotificationResponse;
import com.metricon.notification.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<NotificationResponse> getNotifications(@AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        return notificationService.getMyNotifications(email);
    }

    @PutMapping("/{id}/read")
    public String markAsRead(@PathVariable Long id,
                             @AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        notificationService.markAsRead(id, email);
        return "Notification marked as read";
    }

    @PutMapping("/read-all")
    public String markAllAsRead(@AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        notificationService.markAllAsRead(email);
        return "All notifications marked as read";
    }
}