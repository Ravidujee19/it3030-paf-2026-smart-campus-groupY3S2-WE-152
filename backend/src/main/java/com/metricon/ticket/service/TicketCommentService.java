package com.metricon.ticket.service;

import com.metricon.common.exception.ResourceNotFoundException;
import com.metricon.ticket.entity.Ticket;
import com.metricon.ticket.entity.TicketComment;
import com.metricon.ticket.repository.TicketCommentRepository;
import com.metricon.ticket.repository.TicketRepository;
import com.metricon.user.entity.User;
import com.metricon.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service layer for ticket comments.
 * Enforces ownership rules: only the comment author can edit or delete their own comment.
 */
@Service
public class TicketCommentService {

    private final TicketCommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public TicketCommentService(TicketCommentRepository commentRepository,
                                TicketRepository ticketRepository,
                                UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    // ──────────────────────────────────────────────
    // CREATE — Add a comment to a ticket
    // ──────────────────────────────────────────────

    /**
     * Adds a new comment to the specified ticket.
     *
     * @param ticketId the ticket to comment on
     * @param authorId the user writing the comment
     * @param content  the comment text
     * @return the saved comment
     */
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

        return commentRepository.save(comment);
    }

    // ──────────────────────────────────────────────
    // READ — Retrieve comments
    // ──────────────────────────────────────────────

    /**
     * Retrieves all comments for a ticket, ordered chronologically.
     */
    public List<TicketComment> getCommentsByTicketId(Long ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    /**
     * Retrieves a single comment by its ID.
     */
    public TicketComment getCommentById(Long commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", commentId));
    }

    // ──────────────────────────────────────────────
    // UPDATE — Edit a comment (ownership enforced)
    // ──────────────────────────────────────────────

    /**
     * Edits a comment's content.
     * Only the original author of the comment is allowed to edit it.
     *
     * @param commentId  the comment to edit
     * @param userId     the user attempting the edit
     * @param newContent the updated comment text
     * @return the updated comment
     * @throws SecurityException if the user is not the comment owner
     */
    @Transactional
    public TicketComment editComment(Long commentId, Long userId, String newContent) {
        TicketComment comment = getCommentById(commentId);

        // Ownership check
        validateOwnership(comment, userId);

        comment.setContent(newContent);
        return commentRepository.save(comment);
    }

    // ──────────────────────────────────────────────
    // DELETE — Remove a comment (ownership enforced)
    // ──────────────────────────────────────────────

    /**
     * Deletes a comment.
     * Only the original author of the comment is allowed to delete it.
     *
     * @param commentId the comment to delete
     * @param userId    the user attempting the deletion
     * @throws SecurityException if the user is not the comment owner
     */
    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        TicketComment comment = getCommentById(commentId);

        // Ownership check
        validateOwnership(comment, userId);

        commentRepository.delete(comment);
    }

    // ──────────────────────────────────────────────
    // HELPER — Ownership validation
    // ──────────────────────────────────────────────

    /**
     * Validates that the given user is the author of the comment.
     * Throws a SecurityException if the user does not own the comment.
     */
    private void validateOwnership(TicketComment comment, Long userId) {
        if (!comment.getAuthor().getId().equals(userId)) {
            throw new SecurityException(
                    "Access denied: User " + userId + " is not the owner of comment " + comment.getId()
            );
        }
    }
}
