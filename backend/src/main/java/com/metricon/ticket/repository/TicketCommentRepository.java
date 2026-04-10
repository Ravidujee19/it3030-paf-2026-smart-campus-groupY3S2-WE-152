package com.metricon.ticket.repository;

import com.metricon.ticket.entity.TicketComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketCommentRepository extends JpaRepository<TicketComment, Long> {

    // Find all comments for a specific ticket, ordered by creation time
    List<TicketComment> findByTicketIdOrderByCreatedAtAsc(Long ticketId);

    // Find all comments made by a specific user
    List<TicketComment> findByAuthorId(Long authorId);

    // Count comments on a specific ticket
    long countByTicketId(Long ticketId);
}
