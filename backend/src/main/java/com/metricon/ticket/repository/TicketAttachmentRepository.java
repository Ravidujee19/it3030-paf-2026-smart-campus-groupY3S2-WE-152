package com.metricon.ticket.repository;

import com.metricon.ticket.entity.TicketAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketAttachmentRepository extends JpaRepository<TicketAttachment, Long> {

    // Find all attachments for a specific ticket
    List<TicketAttachment> findByTicketId(Long ticketId);

    // Count attachments on a specific ticket (used to enforce max 3 limit)
    long countByTicketId(Long ticketId);
}
