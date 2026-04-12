package com.metricon.ticket;

import com.metricon.common.exception.ResourceNotFoundException;
import com.metricon.notification.service.NotificationService;
import com.metricon.ticket.dto.CommentRequest;
import com.metricon.ticket.entity.Ticket;
import com.metricon.ticket.entity.TicketComment;
import com.metricon.ticket.repository.TicketCommentRepository;
import com.metricon.ticket.repository.TicketRepository;
import com.metricon.ticket.service.TicketCommentService;
import com.metricon.user.entity.User;
import com.metricon.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TicketCommentServiceTest {

    @Mock
    private TicketCommentRepository commentRepository;

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private TicketCommentService commentService;

    private User sampleUser;
    private Ticket sampleTicket;
    private TicketComment sampleComment;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setEmail("staff@ex.com");

        sampleTicket = new Ticket();
        sampleTicket.setId(10L);
        sampleTicket.setCreatedBy(sampleUser); // Assuming owner is same for simple test

        sampleComment = new TicketComment();
        sampleComment.setId(100L);
        sampleComment.setTicket(sampleTicket);
        sampleComment.setAuthor(sampleUser);
        sampleComment.setContent("Initial text");
        sampleComment.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void addComment_Success() {
        when(ticketRepository.findById(10L)).thenReturn(Optional.of(sampleTicket));
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(commentRepository.save(any(TicketComment.class))).thenReturn(sampleComment);

        TicketComment created = commentService.addComment(10L, 1L, "Test comment");

        assertNotNull(created);
        verify(commentRepository, times(1)).save(any(TicketComment.class));
    }

    @Test
    void editComment_Owner_Success() {
        when(commentRepository.findById(100L)).thenReturn(Optional.of(sampleComment));
        when(commentRepository.save(any(TicketComment.class))).thenReturn(sampleComment);

        TicketComment updated = commentService.editComment(100L, 1L, "Updated text");

        assertEquals("Updated text", updated.getContent());
        verify(commentRepository, times(1)).save(sampleComment);
    }

    @Test
    void editComment_NotOwner_Throws() {
        when(commentRepository.findById(100L)).thenReturn(Optional.of(sampleComment));

        assertThrows(SecurityException.class, () -> commentService.editComment(100L, 2L, "Updated text"));
    }

    @Test
    void deleteComment_Owner_Success() {
        when(commentRepository.findById(100L)).thenReturn(Optional.of(sampleComment));
        doNothing().when(commentRepository).delete(sampleComment);

        assertDoesNotThrow(() -> commentService.deleteComment(100L, 1L));
        verify(commentRepository, times(1)).delete(sampleComment);
    }
}
