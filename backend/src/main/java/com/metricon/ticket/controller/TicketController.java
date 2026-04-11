package com.metricon.ticket.controller;

import com.metricon.ticket.dto.AttachmentResponse;
import com.metricon.ticket.dto.StatusUpdateRequest;
import com.metricon.ticket.dto.TicketCreateRequest;
import com.metricon.ticket.dto.TicketResponse;
import com.metricon.ticket.entity.Ticket;
import com.metricon.ticket.entity.TicketAttachment;
import com.metricon.ticket.entity.TicketPriority;
import com.metricon.ticket.entity.TicketStatus;
import com.metricon.ticket.repository.TicketAttachmentRepository;
import com.metricon.ticket.service.FileStorageService;
import com.metricon.ticket.service.TicketService;
import com.metricon.user.entity.User;
import com.metricon.user.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST controller for Maintenance & Incident Ticketing.
 * Aligned with frontend 2-step creation workflow.
 */
@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class TicketController {

    private final TicketService ticketService;
    private final FileStorageService fileStorageService;
    private final TicketAttachmentRepository attachmentRepository;
    private final UserRepository userRepository;

    public TicketController(TicketService ticketService, 
                            FileStorageService fileStorageService,
                            TicketAttachmentRepository attachmentRepository,
                            UserRepository userRepository) {
        this.ticketService = ticketService;
        this.fileStorageService = fileStorageService;
        this.attachmentRepository = attachmentRepository;
        this.userRepository = userRepository;
    }

    // ──────────────────────────────────────────────
    // GET — Retrieve tickets
    // ──────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<List<TicketResponse>> getAllTickets(
            @RequestParam(required = false) TicketStatus status) {

        List<Ticket> tickets;
        if (status != null) {
            tickets = ticketService.getTicketsByStatus(status);
        } else {
            tickets = ticketService.getAllTickets();
        }

        return ResponseEntity.ok(tickets.stream().map(this::mapToResponse).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(mapToResponse(ticketService.getTicketById(id)));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TicketResponse>> getTicketsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ticketService.getTicketsByCreator(userId).stream()
                .map(this::mapToResponse).collect(Collectors.toList()));
    }

    @GetMapping("/assigned/{technicianId}")
    public ResponseEntity<List<TicketResponse>> getTicketsByAssignee(@PathVariable Long technicianId) {
        return ResponseEntity.ok(ticketService.getTicketsByAssignee(technicianId).stream()
                .map(this::mapToResponse).collect(Collectors.toList()));
    }

    // ──────────────────────────────────────────────
    // POST — Create a new ticket
    // ──────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(@Valid @RequestBody TicketCreateRequest request) {
        Ticket ticket = mapFromCreateRequest(request);
        Ticket savedTicket = ticketService.createTicket(ticket, request.getCreatedByUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(savedTicket));
    }

    // ──────────────────────────────────────────────
    // ATTACHMENTS — Fixed Multi-upload with Persistence
    // ──────────────────────────────────────────────

    /**
     * POST /api/tickets/{id}/attachments
     * Aligned with frontend two-step creation. Handles array of files and identification of uploader.
     */
    @PostMapping("/{id}/attachments")
    public ResponseEntity<Void> uploadAttachments(
            @PathVariable Long id,
            @RequestParam("attachments") MultipartFile[] files,
            @RequestParam Long userId) {

        Ticket ticket = ticketService.getTicketById(id);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Uploader (User) not found"));

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            // 1. Store on Disk
            String fileUrl = fileStorageService.storeFile(file, id);
            
            // 2. Persist in DB
            TicketAttachment attachment = new TicketAttachment();
            attachment.setFileUrl(fileUrl);
            attachment.setFileName(file.getOriginalFilename());
            attachment.setContentType(file.getContentType());
            attachment.setFileSize(file.getSize());
            attachment.setTicket(ticket);
            attachment.setUploadedBy(user);
            
            attachmentRepository.save(attachment);
        }

        return ResponseEntity.ok().build();
    }

    // ──────────────────────────────────────────────
    // PATCH — Workflow Transitions
    // ──────────────────────────────────────────────

    @PatchMapping("/{id}/status")
    public ResponseEntity<TicketResponse> updateTicketStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(mapToResponse(ticketService.updateTicketStatus(id, request.getStatus())));
    }

    @PatchMapping("/{id}/priority")
    public ResponseEntity<TicketResponse> updateTicketPriority(
            @PathVariable Long id,
            @RequestParam String priority) {
        Ticket ticket = new Ticket();
        ticket.setPriority(TicketPriority.valueOf(priority));
        return ResponseEntity.ok(mapToResponse(ticketService.updateTicket(id, ticket)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TicketResponse> updateTicket(
            @PathVariable Long id,
            @Valid @RequestBody Ticket updatedTicket) {
        return ResponseEntity.ok(mapToResponse(ticketService.updateTicket(id, updatedTicket)));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<TicketResponse> assignTechnician(
            @PathVariable Long id,
            @RequestParam Long technicianId) {
        return ResponseEntity.ok(mapToResponse(ticketService.assignTechnician(id, technicianId)));
    }

    // ──────────────────────────────────────────────
    // DELETE
    // ──────────────────────────────────────────────

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    // ──────────────────────────────────────────────
    // MAPPER
    // ──────────────────────────────────────────────

    private TicketResponse mapToResponse(Ticket ticket) {
        TicketResponse res = new TicketResponse();
        res.setId(ticket.getId());
        res.setTitle(ticket.getTitle());
        res.setDescription(ticket.getDescription());
        res.setCategory(ticket.getCategory());
        res.setPriority(ticket.getPriority());
        res.setStatus(ticket.getStatus());
        res.setLocation(ticket.getLocation());
        res.setResourceName(ticket.getResourceName());
        res.setContactEmail(ticket.getContactEmail());
        res.setContactPhone(ticket.getContactPhone());
        res.setResolutionNotes(ticket.getResolutionNotes());

        if (ticket.getCreatedBy() != null) {
            res.setCreatedById(ticket.getCreatedBy().getId());
            res.setCreatedByName(ticket.getCreatedBy().getName());
        }
        if (ticket.getAssignedTo() != null) {
            res.setAssignedToId(ticket.getAssignedTo().getId());
            res.setAssignedToName(ticket.getAssignedTo().getName());
        }

        res.setCreatedAt(ticket.getCreatedAt());
        res.setUpdatedAt(ticket.getUpdatedAt());
        res.setResolvedAt(ticket.getResolvedAt());
        res.setClosedAt(ticket.getClosedAt());

        res.setCommentCount(ticket.getComments() != null ? ticket.getComments().size() : 0);
        res.setAttachmentCount(ticket.getAttachments() != null ? ticket.getAttachments().size() : 0);
        
        // Map attachments with full details for frontend display
        if (ticket.getAttachments() != null && !ticket.getAttachments().isEmpty()) {
            res.setAttachments(ticket.getAttachments().stream()
                    .map(this::mapAttachmentToResponse)
                    .collect(Collectors.toList()));
        } else {
            // Always initialize with empty list instead of null
            res.setAttachments(new java.util.ArrayList<>());
        }

        return res;
    }

    private AttachmentResponse mapAttachmentToResponse(TicketAttachment attachment) {
        AttachmentResponse res = new AttachmentResponse();
        res.setId(attachment.getId());
        res.setFileUrl(attachment.getFileUrl());
        res.setFileName(attachment.getFileName());
        res.setContentType(attachment.getContentType());
        res.setFileSize(attachment.getFileSize());
        if (attachment.getUploadedBy() != null) {
            res.setUploadedById(attachment.getUploadedBy().getId());
            res.setUploadedByName(attachment.getUploadedBy().getName());
        }
        res.setUploadedAt(attachment.getUploadedAt());
        return res;
    }

    private Ticket mapFromCreateRequest(TicketCreateRequest req) {
        Ticket t = new Ticket();
        t.setTitle(req.getTitle());
        t.setDescription(req.getDescription());
        t.setCategory(req.getCategory());
        t.setPriority(req.getPriority());
        t.setLocation(req.getLocation());
        t.setResourceName(req.getResourceName());
        t.setContactEmail(req.getContactEmail());
        t.setContactPhone(req.getContactPhone());
        return t;
    }
}