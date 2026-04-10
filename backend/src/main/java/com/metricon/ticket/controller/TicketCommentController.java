package com.metricon.ticket.controller;

import com.metricon.ticket.dto.CommentRequest;
import com.metricon.ticket.dto.CommentResponse;
import com.metricon.ticket.entity.TicketComment;
import com.metricon.ticket.service.TicketCommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tickets")
@PreAuthorize("isAuthenticated()")
public class TicketCommentController {

    private final TicketCommentService commentService;

    public TicketCommentController(TicketCommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/{ticketId}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long ticketId) {
        List<CommentResponse> comments = commentService.getCommentsByTicketId(ticketId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/{ticketId}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long ticketId,
            @Valid @RequestBody CommentRequest request) {

        TicketComment comment = commentService.addComment(
                ticketId, request.getUserId(), request.getContent());

        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(comment));
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<CommentResponse> editComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequest request) {

        TicketComment updated = commentService.editComment(
                commentId, request.getUserId(), request.getContent());

        return ResponseEntity.ok(mapToResponse(updated));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @RequestParam Long userId) {

        commentService.deleteComment(commentId, userId);
        return ResponseEntity.noContent().build();
    }

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
