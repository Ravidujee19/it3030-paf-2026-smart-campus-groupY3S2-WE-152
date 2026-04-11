package com.metricon.ticket.repository;

import com.metricon.ticket.entity.Ticket;
import com.metricon.ticket.entity.TicketCategory;
import com.metricon.ticket.entity.TicketPriority;
import com.metricon.ticket.entity.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // Find all tickets created by a specific user
    List<Ticket> findByCreatedById(Long userId);

    // Find all tickets assigned to a specific technician
    List<Ticket> findByAssignedToId(Long technicianId);

    // Filter tickets by status
    List<Ticket> findByStatus(TicketStatus status);

    // Filter tickets by category
    List<Ticket> findByCategory(TicketCategory category);

    // Filter tickets by priority
    List<Ticket> findByPriority(TicketPriority priority);

    // Filter tickets by status and priority (e.g., all OPEN + CRITICAL)
    List<Ticket> findByStatusAndPriority(TicketStatus status, TicketPriority priority);

    // Search tickets by location (case-insensitive partial match)
    List<Ticket> findByLocationContainingIgnoreCase(String location);

    // Count tickets by status (useful for dashboard stats)
    long countByStatus(TicketStatus status);

    // Fetch all tickets with eager loaded attachments
    @Query("SELECT t FROM Ticket t LEFT JOIN FETCH t.attachments")
    List<Ticket> findAllWithAttachments();

    // Fetch ticket by ID with eager loaded attachments
    @Query("SELECT t FROM Ticket t LEFT JOIN FETCH t.attachments WHERE t.id = ?1")
    Optional<Ticket> findByIdWithAttachments(Long id);

    // Fetch tickets by status with eager loaded attachments
    @Query("SELECT t FROM Ticket t LEFT JOIN FETCH t.attachments WHERE t.status = ?1")
    List<Ticket> findByStatusWithAttachments(TicketStatus status);
}
