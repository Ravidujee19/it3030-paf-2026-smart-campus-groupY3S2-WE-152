package com.metricon.ticket.controller;

import com.metricon.ticket.dto.StatusUpdateRequest;
import com.metricon.ticket.dto.TicketCreateRequest;
import com.metricon.ticket.dto.TicketResponse;
import com.metricon.ticket.entity.Ticket;
import com.metricon.ticket.entity.TicketStatus;
import com.metricon.ticket.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST controller for Maintenance & Incident Ticketing.
 * Exposes all 4 HTTP methods: GET, POST, PATCH, DELETE.
 */
@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // ──────────────────────────────────────────────
    // GET — Retrieve tickets
    // ──────────────────────────────────────────────

    /**
     * GET /api/tickets
     * Retrieve all tickets. Optionally filter by status.
     */
    @GetMapping
    public ResponseEntity<List<TicketResponse>> getAllTickets(
            @RequestParam(required = false) TicketStatus status) {

        List<Ticket> tickets;
        if (status != null) {
            tickets = ticketService.getTicketsByStatus(status);
        } else {
            tickets = ticketService.getAllTickets();
        }

        List<TicketResponse> response = tickets.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/tickets/{id}
     * Retrieve a single ticket by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable Long id) {
        Ticket ticket = ticketService.getTicketById(id);
        return ResponseEntity.ok(mapToResponse(ticket));
    }

    /**
     * GET /api/tickets/user/{userId}
     * Retrieve all tickets created by a specific user.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TicketResponse>> getTicketsByUser(@PathVariable Long userId) {
        List<TicketResponse> response = ticketService.getTicketsByCreator(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/tickets/assigned/{technicianId}
     * Retrieve all tickets assigned to a specific technician.
     */
    @GetMapping("/assigned/{technicianId}")
    public ResponseEntity<List<TicketResponse>> getTicketsByAssignee(@PathVariable Long technicianId) {
        List<TicketResponse> response = ticketService.getTicketsByAssignee(technicianId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // ──────────────────────────────────────────────
    // POST — Create a new ticket
    // ──────────────────────────────────────────────

    /**
     * POST /api/tickets
     * Create a new maintenance/incident ticket.
     */
    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(@Valid @RequestBody TicketCreateRequest request) {
        Ticket ticket = mapFromCreateRequest(request);
        Ticket savedTicket = ticketService.createTicket(ticket, request.getCreatedByUserId());

        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(savedTicket));
    }

    // ──────────────────────────────────────────────
    // PATCH — Update ticket status (workflow)
    // ──────────────────────────────────────────────

    /**
     * PATCH /api/tickets/{id}/status
     * Update the status of a ticket following the allowed workflow transitions.
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<TicketResponse> updateTicketStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {

        Ticket updatedTicket = ticketService.updateTicketStatus(id, request.getStatus());
        return ResponseEntity.ok(mapToResponse(updatedTicket));
    }

    /**
     * PATCH /api/tickets/{id}/assign
     * Assign a technician to a ticket.
     */
    @PatchMapping("/{id}/assign")
    public ResponseEntity<TicketResponse> assignTechnician(
            @PathVariable Long id,
            @RequestParam Long technicianId) {

        Ticket updatedTicket = ticketService.assignTechnician(id, technicianId);
        return ResponseEntity.ok(mapToResponse(updatedTicket));
    }

    // ──────────────────────────────────────────────
    // DELETE — Remove a ticket
    // ──────────────────────────────────────────────

    /**
     * DELETE /api/tickets/{id}
     * Delete a ticket and all its associated comments and attachments.
     * Returns HTTP 204 No Content on success.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    // ──────────────────────────────────────────────
    // MAPPER: Entity <-> DTO
    // ──────────────────────────────────────────────

    /**
     * Maps a Ticket entity to a TicketResponse DTO.
     */
    private TicketResponse mapToResponse(Ticket ticket) {
        TicketResponse response = new TicketResponse();
        response.setId(ticket.getId());
        response.setTitle(ticket.getTitle());
        response.setDescription(ticket.getDescription());
        response.setCategory(ticket.getCategory());
        response.setPriority(ticket.getPriority());
        response.setStatus(ticket.getStatus());
        response.setLocation(ticket.getLocation());
        response.setResourceName(ticket.getResourceName());
        response.setContactEmail(ticket.getContactEmail());
        response.setContactPhone(ticket.getContactPhone());
        response.setResolutionNotes(ticket.getResolutionNotes());

        // Flatten user references
        if (ticket.getCreatedBy() != null) {
            response.setCreatedById(ticket.getCreatedBy().getId());
            response.setCreatedByName(ticket.getCreatedBy().getName());
        }
        if (ticket.getAssignedTo() != null) {
            response.setAssignedToId(ticket.getAssignedTo().getId());
            response.setAssignedToName(ticket.getAssignedTo().getName());
        }

        response.setCreatedAt(ticket.getCreatedAt());
        response.setUpdatedAt(ticket.getUpdatedAt());
        response.setResolvedAt(ticket.getResolvedAt());
        response.setClosedAt(ticket.getClosedAt());

        // Collection sizes (avoids serializing full lists)
        response.setCommentCount(ticket.getComments() != null ? ticket.getComments().size() : 0);
        response.setAttachmentCount(ticket.getAttachments() != null ? ticket.getAttachments().size() : 0);

        return response;
    }

    /**
     * Maps a TicketCreateRequest DTO to a Ticket entity.
     */
    private Ticket mapFromCreateRequest(TicketCreateRequest request) {
        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setCategory(request.getCategory());
        ticket.setPriority(request.getPriority());
        ticket.setLocation(request.getLocation());
        ticket.setResourceName(request.getResourceName());
        ticket.setContactEmail(request.getContactEmail());
        ticket.setContactPhone(request.getContactPhone());
        return ticket;
    }
}
