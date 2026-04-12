package com.metricon.ticket.entity;

/**
 * Represents the lifecycle status of a maintenance/incident ticket.
 * Workflow: OPEN -> IN_PROGRESS -> RESOLVED -> CLOSED
 * Admin can also set REJECTED at any point.
 */
public enum TicketStatus {
    OPEN,
    IN_PROGRESS,
    RESOLVED,
    CLOSED,
    REJECTED
}
