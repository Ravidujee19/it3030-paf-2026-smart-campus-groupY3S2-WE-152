package com.metricon.ticket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for returning comment data in API responses.
 * Flattens author info to avoid lazy-loading serialization issues.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {

    private Long id;
    private String content;
    private Long ticketId;
    private Long authorId;
    private String authorName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean edited;
}
