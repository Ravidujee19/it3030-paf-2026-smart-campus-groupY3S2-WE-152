package com.metricon.ticket.service;

import com.metricon.common.enums.NotificationType;
import com.metricon.common.exception.ResourceNotFoundException;
import com.metricon.notification.service.NotificationService;
import com.metricon.ticket.entity.Ticket;
import com.metricon.ticket.entity.TicketComment;
import com.metricon.ticket.repository.TicketCommentRepository;
import com.metricon.ticket.repository.TicketRepository;
import com.metricon.user.entity.User;
import com.metricon.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TicketCommentService {

    private final TicketCommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public TicketCommentService(TicketCommentRepository commentRepository,
            TicketRepository ticketRepository,
            UserRepository userRepository,
            NotificationService notificationService) {
        this.commentRepository = commentRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public TicketComment addComment(Long ticketId, Long authorId, String content) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", ticketId));

        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", authorId));

        TicketComment comment = new TicketComment();
        comment.setTicket(ticket);
        comment.setAuthor(author);
        comment.setContent(content);

        TicketComment saved = commentRepository.save(comment);

        String ticketTitle = ticket.getTitle();
        String authorName = author.getName();

        // Notify ticket creator
        if (ticket.getCreatedBy() != null && !ticket.getCreatedBy().getId().equals(authorId)) {
            notificationService.createNotification(
                    ticket.getCreatedBy().getEmail(),
                    "New Comment on Your Ticket",
                    authorName + " commented on your ticket \"" + ticketTitle + "\".",
                    NotificationType.INFO
            );
        }

        // Notify assigned technician 
        if (ticket.getAssignedTo() != null
                && !ticket.getAssignedTo().getId().equals(authorId)
                && (ticket.getCreatedBy() == null || !ticket.getAssignedTo().getId().equals(ticket.getCreatedBy().getId()))) {
            notificationService.createNotification(
                    ticket.getAssignedTo().getEmail(),
                    "New Comment on Assigned Ticket",
                    authorName + " commented on ticket \"" + ticketTitle + "\" assigned to you.",
                    NotificationType.INFO
            );
        }

        return saved;
    }

    public List<TicketComment> getCommentsByTicketId(Long ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    public TicketComment getCommentById(Long commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", commentId));
    }

    @Transactional
    public TicketComment editComment(Long commentId, Long userId, String newContent) {
        TicketComment comment = getCommentById(commentId);

        // Ownership check
        validateOwnership(comment, userId);

        comment.setContent(newContent);
        return commentRepository.save(comment);
    }
    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        TicketComment comment = getCommentById(commentId);

        // Ownership check
        validateOwnership(comment, userId);

        commentRepository.delete(comment);
    }

    private void validateOwnership(TicketComment comment, Long userId) {
        if (!comment.getAuthor().getId().equals(userId)) {
            throw new SecurityException(
                    "Access denied: User " + userId + " is not the owner of comment " + comment.getId());
        }
    }
}
