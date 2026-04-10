package com.metricon.notification;

import com.metricon.common.enums.NotificationType;
import com.metricon.notification.dto.NotificationResponse;
import com.metricon.notification.entity.Notification;
import com.metricon.notification.repository.NotificationRepository;
import com.metricon.notification.service.NotificationServiceImpl;
import com.metricon.user.entity.User;
import com.metricon.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private NotificationServiceImpl notificationService;

    private User sampleUser;
    private Notification sampleNotification;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setEmail("test@ex.com");

        sampleNotification = new Notification();
        sampleNotification.setId(1L);
        sampleNotification.setUser(sampleUser);
        sampleNotification.setTitle("Test Title");
        sampleNotification.setMessage("Test Msg");
        sampleNotification.setRead(false);
        sampleNotification.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void createNotification_Success() {
        when(userRepository.findByEmail("test@ex.com")).thenReturn(Optional.of(sampleUser));
        when(notificationRepository.save(any(Notification.class))).thenReturn(sampleNotification);

        notificationService.createNotification("test@ex.com", "Test Title", "Test Msg", NotificationType.INFO);

        verify(notificationRepository, times(1)).save(any(Notification.class));
        verify(messagingTemplate, times(1)).convertAndSendToUser(eq("test@ex.com"), eq("/queue/notifications"), any(NotificationResponse.class));
    }

    @Test
    void createNotification_UserNotFound_SilentIgnore() {
        when(userRepository.findByEmail("unknown@ex.com")).thenReturn(Optional.empty());

        assertDoesNotThrow(() -> notificationService.createNotification("unknown@ex.com", "Title", "Msg", NotificationType.INFO));
        verify(notificationRepository, never()).save(any(Notification.class));
    }

    @Test
    void getMyNotifications_Success() {
        when(userRepository.findByEmail("test@ex.com")).thenReturn(Optional.of(sampleUser));
        when(notificationRepository.findByUserOrderByCreatedAtDesc(sampleUser)).thenReturn(List.of(sampleNotification));

        List<NotificationResponse> result = notificationService.getMyNotifications("test@ex.com");

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }

    @Test
    void markAsRead_Success() {
        when(userRepository.findByEmail("test@ex.com")).thenReturn(Optional.of(sampleUser));
        when(notificationRepository.findByIdAndUser(1L, sampleUser)).thenReturn(Optional.of(sampleNotification));
        when(notificationRepository.save(any(Notification.class))).thenReturn(sampleNotification);

        notificationService.markAsRead(1L, "test@ex.com");

        assertTrue(sampleNotification.isRead());
        verify(notificationRepository, times(1)).save(sampleNotification);
    }
}
