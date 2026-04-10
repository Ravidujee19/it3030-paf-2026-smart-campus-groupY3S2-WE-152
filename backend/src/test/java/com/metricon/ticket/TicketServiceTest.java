package com.metricon.ticket;

import com.metricon.common.exception.InvalidStatusTransitionException;
import com.metricon.common.exception.ResourceNotFoundException;
import com.metricon.notification.service.NotificationService;
import com.metricon.ticket.entity.Ticket;
import com.metricon.ticket.entity.TicketStatus;
import com.metricon.ticket.repository.TicketAttachmentRepository;
import com.metricon.ticket.repository.TicketRepository;
import com.metricon.ticket.service.FileStorageService;
import com.metricon.ticket.service.TicketService;
import com.metricon.user.entity.User;
import com.metricon.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private UserRepository userRepository;
    
    @Mock
    private NotificationService notificationService;

    @Mock
    private FileStorageService fileStorageService;
    
    @Mock
    private TicketAttachmentRepository attachmentRepository;

    @InjectMocks
    private TicketService ticketService;

    private User sampleUser;
    private Ticket sampleTicket;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setEmail("user@ex.com");

        sampleTicket = new Ticket();
        sampleTicket.setId(100L);
        sampleTicket.setTitle("Broken AC");
        sampleTicket.setStatus(TicketStatus.OPEN);
        sampleTicket.setCreatedBy(sampleUser);
    }

    @Test
    void createTicket_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(ticketRepository.save(any(Ticket.class))).thenReturn(sampleTicket);

        Ticket created = ticketService.createTicket(new Ticket(), 1L);

        assertNotNull(created);
        assertEquals(TicketStatus.OPEN, created.getStatus());
        verify(ticketRepository, times(1)).save(any(Ticket.class));
    }

    @Test
    void updateTicketStatus_ValidTransition_Success() {
        when(ticketRepository.findById(100L)).thenReturn(Optional.of(sampleTicket));
        when(ticketRepository.save(any(Ticket.class))).thenReturn(sampleTicket);

        Ticket updated = ticketService.updateTicketStatus(100L, TicketStatus.IN_PROGRESS);

        assertEquals(TicketStatus.IN_PROGRESS, updated.getStatus());
        verify(ticketRepository, times(1)).save(sampleTicket);
    }

    @Test
    void updateTicketStatus_InvalidTransition_Throws() {
        when(ticketRepository.findById(100L)).thenReturn(Optional.of(sampleTicket));
        
        sampleTicket.setStatus(TicketStatus.CLOSED);

        assertThrows(InvalidStatusTransitionException.class, 
                () -> ticketService.updateTicketStatus(100L, TicketStatus.OPEN));
    }

    @Test
    void assignTechnician_Success() {
        User tech = new User();
        tech.setId(2L);
        tech.setEmail("tech@ex.com");

        when(ticketRepository.findById(100L)).thenReturn(Optional.of(sampleTicket));
        when(userRepository.findById(2L)).thenReturn(Optional.of(tech));
        when(ticketRepository.save(any(Ticket.class))).thenReturn(sampleTicket);

        Ticket updated = ticketService.assignTechnician(100L, 2L);

        assertEquals(tech, updated.getAssignedTo());
        verify(ticketRepository, times(1)).save(sampleTicket);
    }

    @Test
    void deleteTicket_Success() {
        when(ticketRepository.findById(100L)).thenReturn(Optional.of(sampleTicket));
        doNothing().when(ticketRepository).delete(sampleTicket);

        assertDoesNotThrow(() -> ticketService.deleteTicket(100L));
        verify(ticketRepository, times(1)).delete(sampleTicket);
    }
}
