package com.metricon.ticket.dto;

import com.metricon.ticket.entity.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for the PATCH /api/tickets/{id}/status endpoint.
 * Only carries the new status to transition to.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusUpdateRequest {

    @NotNull(message = "New status is required")
    private TicketStatus status;
}
