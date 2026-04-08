package com.metricon.ticket.dto;

import com.metricon.ticket.entity.TicketCategory;
import com.metricon.ticket.entity.TicketPriority;
import com.metricon.ticket.entity.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for returning ticket data in API responses.
 * Avoids exposing raw entity relationships and lazy-loading issues.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponse {

    private Long id;
    private String title;
    private String description;
    private TicketCategory category;
    private TicketPriority priority;
    private TicketStatus status;
    private String location;
    private String resourceName;
    private String contactEmail;
    private String contactPhone;
    private String resolutionNotes;

    // Flattened user info (avoid nested entity serialization)
    private Long createdById;
    private String createdByName;
    private Long assignedToId;
    private String assignedToName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;

    private int commentCount;
    private int attachmentCount;
}
