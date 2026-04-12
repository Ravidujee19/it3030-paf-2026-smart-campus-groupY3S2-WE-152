package com.metricon.ticket.dto;

import com.metricon.ticket.entity.TicketCategory;
import com.metricon.ticket.entity.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating a new ticket.
 * Contains only the fields the user needs to provide.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketCreateRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private TicketCategory category;

    @NotNull(message = "Priority is required")
    private TicketPriority priority;

    @NotBlank(message = "Location is required")
    private String location;

    private String resourceName;

    private String contactEmail;

    private String contactPhone;

    // Creator user ID (will be replaced by auth context later)
    @NotNull(message = "Creator user ID is required")
    private Long createdByUserId;
}
