package com.metricon.ticket.service;

import com.metricon.common.exception.InvalidStatusTransitionException;
import com.metricon.common.exception.ResourceNotFoundException;
import com.metricon.ticket.entity.Ticket;
import com.metricon.ticket.entity.TicketStatus;
import com.metricon.ticket.repository.TicketRepository;
import com.metricon.user.entity.User;
import com.metricon.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Service layer for Ticket CRUD operations and business logic.
 * Enforces the ticket status workflow:
 *   OPEN -> IN_PROGRESS -> RESOLVED -> CLOSED
 *   Any status -> REJECTED (admin only)
 */
@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    /**
     * Defines the allowed status transitions.
     * Key = current status, Value = set of allowed next statuses.
     * REJECTED is allowed from any status (handled separately).
     */
    private static final Map<TicketStatus, Set<TicketStatus>> ALLOWED_TRANSITIONS = Map.of(
            TicketStatus.OPEN, Set.of(TicketStatus.IN_PROGRESS, TicketStatus.REJECTED),
            TicketStatus.IN_PROGRESS, Set.of(TicketStatus.RESOLVED, TicketStatus.REJECTED),
            TicketStatus.RESOLVED, Set.of(TicketStatus.CLOSED, TicketStatus.REJECTED),
            TicketStatus.CLOSED, Set.of(),
            TicketStatus.REJECTED, Set.of()
    );

    public TicketService(TicketRepository ticketRepository, UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    // ──────────────────────────────────────────────
    // CREATE
    // ──────────────────────────────────────────────

    /**
     * Creates a new ticket. Sets the creator and defaults status to OPEN.
     */
    @Transactional
    public Ticket createTicket(Ticket ticket, Long creatorUserId) {
        User creator = userRepository.findById(creatorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", creatorUserId));

        ticket.setCreatedBy(creator);
        ticket.setStatus(TicketStatus.OPEN);

        return ticketRepository.save(ticket);
    }

    // ──────────────────────────────────────────────
    // READ
    // ──────────────────────────────────────────────

    /**
     * Retrieves a ticket by its ID.
     */
    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", id));
    }

    /**
     * Retrieves all tickets.
     */
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    /**
     * Retrieves all tickets created by a specific user.
     */
    public List<Ticket> getTicketsByCreator(Long userId) {
        return ticketRepository.findByCreatedById(userId);
    }

    /**
     * Retrieves all tickets assigned to a specific technician.
     */
    public List<Ticket> getTicketsByAssignee(Long technicianId) {
        return ticketRepository.findByAssignedToId(technicianId);
    }

    /**
     * Retrieves all tickets with a given status.
     */
    public List<Ticket> getTicketsByStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status);
    }

    // ──────────────────────────────────────────────
    // UPDATE STATUS (with workflow enforcement)
    // ──────────────────────────────────────────────

    /**
     * Updates the status of a ticket while enforcing the allowed workflow transitions.
     * Also sets resolvedAt/closedAt timestamps when applicable.
     *
     * @throws ResourceNotFoundException if ticket not found
     * @throws InvalidStatusTransitionException if transition is not allowed
     */
    @Transactional
    public Ticket updateTicketStatus(Long ticketId, TicketStatus newStatus) {
        Ticket ticket = getTicketById(ticketId);
        TicketStatus currentStatus = ticket.getStatus();

        // Validate the transition
        if (!isTransitionAllowed(currentStatus, newStatus)) {
            throw new InvalidStatusTransitionException(currentStatus.name(), newStatus.name());
        }

        ticket.setStatus(newStatus);

        // Set lifecycle timestamps
        if (newStatus == TicketStatus.RESOLVED) {
            ticket.setResolvedAt(LocalDateTime.now());
        } else if (newStatus == TicketStatus.CLOSED) {
            ticket.setClosedAt(LocalDateTime.now());
        }

        return ticketRepository.save(ticket);
    }

    // ──────────────────────────────────────────────
    // ASSIGN TECHNICIAN
    // ──────────────────────────────────────────────

    /**
     * Assigns a technician to a ticket.
     */
    @Transactional
    public Ticket assignTechnician(Long ticketId, Long technicianId) {
        Ticket ticket = getTicketById(ticketId);
        User technician = userRepository.findById(technicianId)
                .orElseThrow(() -> new ResourceNotFoundException("User", technicianId));

        ticket.setAssignedTo(technician);

        return ticketRepository.save(ticket);
    }

    // ──────────────────────────────────────────────
    // ADD RESOLUTION NOTES
    // ──────────────────────────────────────────────

    /**
     * Allows a technician to add resolution notes to a ticket.
     */
    @Transactional
    public Ticket addResolutionNotes(Long ticketId, String notes) {
        Ticket ticket = getTicketById(ticketId);
        ticket.setResolutionNotes(notes);

        return ticketRepository.save(ticket);
    }

    // ──────────────────────────────────────────────
    // HELPER: Status transition validation
    // ──────────────────────────────────────────────

    /**
     * Checks whether transitioning from currentStatus to newStatus is allowed.
     */
    private boolean isTransitionAllowed(TicketStatus currentStatus, TicketStatus newStatus) {
        Set<TicketStatus> allowed = ALLOWED_TRANSITIONS.get(currentStatus);
        return allowed != null && allowed.contains(newStatus);
    }
}
