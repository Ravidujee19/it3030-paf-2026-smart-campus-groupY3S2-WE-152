package com.metricon.ticket.controller;

import com.metricon.ticket.dto.CommentRequest;
import com.metricon.ticket.dto.CommentResponse;
import com.metricon.ticket.entity.TicketComment;
import com.metricon.ticket.service.TicketCommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST controller for ticket comments.
 * Provides POST, PUT, DELETE with ownership enforcement on edit/delete.
 */
@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class TicketCommentController {

    private final TicketCommentService commentService;

    public TicketCommentController(TicketCommentService commentService) {
        this.commentService = commentService;
    }

    // ──────────────────────────────────────────────
    // GET — List comments for a ticket
    // ──────────────────────────────────────────────

    /**
     * GET /api/tickets/{ticketId}/comments
     * Retrieve all comments for a specific ticket in chronological order.
     */
    @GetMapping("/{ticketId}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long ticketId) {
        List<CommentResponse> comments = commentService.getCommentsByTicketId(ticketId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(comments);
    }

    // ──────────────────────────────────────────────
    // POST — Add a comment to a ticket
    // ──────────────────────────────────────────────

    /**
     * POST /api/tickets/{ticketId}/comments
     * Add a new comment to a ticket.
     */
    @PostMapping("/{ticketId}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long ticketId,
            @Valid @RequestBody CommentRequest request) {

        TicketComment comment = commentService.addComment(
                ticketId, request.getUserId(), request.getContent());

        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(comment));
    }

    // ──────────────────────────────────────────────
    // PUT — Edit a comment (ownership enforced)
    // ──────────────────────────────────────────────

    /**
     * PUT /api/tickets/comments/{commentId}
     * Edit an existing comment. Only the original author can perform this action.
     */
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<CommentResponse> editComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequest request) {

        TicketComment updated = commentService.editComment(
                commentId, request.getUserId(), request.getContent());

        return ResponseEntity.ok(mapToResponse(updated));
    }

    // ──────────────────────────────────────────────
    // DELETE — Delete a comment (ownership enforced)
    // ──────────────────────────────────────────────

    /**
     * DELETE /api/tickets/comments/{commentId}
     * Delete a comment. Only the original author can perform this action.
     * Returns HTTP 204 No Content on success.
     */
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @RequestParam Long userId) {

        commentService.deleteComment(commentId, userId);
        return ResponseEntity.noContent().build();
    }

    // ──────────────────────────────────────────────
    // MAPPER — Entity to Response DTO
    // ──────────────────────────────────────────────

    private CommentResponse mapToResponse(TicketComment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setTicketId(comment.getTicket().getId());
        response.setAuthorId(comment.getAuthor().getId());
        response.setAuthorName(comment.getAuthor().getName());
        response.setCreatedAt(comment.getCreatedAt());
        response.setUpdatedAt(comment.getUpdatedAt());
        response.setEdited(comment.isEdited());
        return response;
    }
}
