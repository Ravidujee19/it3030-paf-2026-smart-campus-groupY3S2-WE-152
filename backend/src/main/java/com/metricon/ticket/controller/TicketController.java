package com.metricon.ticket.controller;

import com.metricon.ticket.dto.StatusUpdateRequest;
import com.metricon.ticket.dto.TicketCreateRequest;
import com.metricon.ticket.dto.TicketResponse;
import com.metricon.ticket.dto.AttachmentResponse;
import com.metricon.ticket.entity.Ticket;
import com.metricon.ticket.entity.TicketAttachment;
import com.metricon.ticket.entity.TicketStatus;
import com.metricon.ticket.service.TicketService;
import com.metricon.user.entity.User;
import com.metricon.user.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;
    private final UserRepository userRepository;

    public TicketController(TicketService ticketService, UserRepository userRepository) {
        this.ticketService = ticketService;
        this.userRepository = userRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'TECHNICIAN')")
    public ResponseEntity<List<TicketResponse>> getAllTickets(
            @RequestParam(required = false) TicketStatus status) {

        List<Ticket> tickets = (status != null)
                ? ticketService.getTicketsByStatus(status)
                : ticketService.getAllTickets();

        return ResponseEntity.ok(
                tickets.stream().map(this::mapToResponse).collect(Collectors.toList())
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'TECHNICIAN')")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(mapToResponse(ticketService.getTicketById(id)));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'STUDENT')")
    public ResponseEntity<List<TicketResponse>> getTicketsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(
                ticketService.getTicketsByCreator(userId).stream()
                        .map(this::mapToResponse)
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TicketResponse>> getMyTickets(
            @AuthenticationPrincipal OAuth2User principal) {

        String email = principal.getAttribute("email");
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(
                ticketService.getTicketsByCreator(user.getId()).stream()
                        .map(this::mapToResponse)
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/assigned/{technicianId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<List<TicketResponse>> getTicketsByAssignee(
            @PathVariable Long technicianId) {

        return ResponseEntity.ok(
                ticketService.getTicketsByAssignee(technicianId).stream()
                        .map(this::mapToResponse)
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/mine-assigned")
    @PreAuthorize("hasAnyRole('TECHNICIAN', 'ADMIN')")
    public ResponseEntity<List<TicketResponse>> getMyAssignedTickets(
            @AuthenticationPrincipal OAuth2User principal) {

        String email = principal.getAttribute("email");
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(
                ticketService.getTicketsByAssignee(user.getId()).stream()
                        .map(this::mapToResponse)
                        .collect(Collectors.toList())
        );
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'STUDENT')")
    public ResponseEntity<TicketResponse> createTicket(
            @Valid @RequestBody TicketCreateRequest request,
            @AuthenticationPrincipal OAuth2User principal) {

        String email = principal.getAttribute("email");
        User creator = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        Ticket ticket = mapFromCreateRequest(request);
        Ticket saved = ticketService.createTicket(ticket, creator.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(saved));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<TicketResponse> updateTicketStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {

        return ResponseEntity.ok(mapToResponse(ticketService.updateTicketStatus(id, request.getStatus())));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketResponse> assignTechnician(
            @PathVariable Long id,
            @RequestParam Long technicianId) {

        return ResponseEntity.ok(mapToResponse(ticketService.assignTechnician(id, technicianId)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/attachments")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'STUDENT')")
    public ResponseEntity<List<AttachmentResponse>> uploadAttachments(
            @PathVariable Long id,
            @RequestParam("files") MultipartFile[] files,
            @AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        User creator = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        List<TicketAttachment> saved = ticketService.addAttachments(id, files, creator.getId());
        return ResponseEntity.ok(saved.stream().map(this::mapAttachmentToResponse).collect(Collectors.toList()));
    }

    @GetMapping("/{id}/attachments")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'TECHNICIAN', 'STUDENT')")
    public ResponseEntity<List<AttachmentResponse>> getAttachments(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getAttachments(id).stream()
                .map(this::mapAttachmentToResponse).collect(Collectors.toList()));
    }

    @DeleteMapping("/attachments/{attachmentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'STUDENT')")
    public ResponseEntity<Void> deleteAttachment(
            @PathVariable Long attachmentId,
            @AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        ticketService.deleteAttachment(attachmentId, user.getId(), isAdmin);
        return ResponseEntity.noContent().build();
    }

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
        response.setCommentCount(ticket.getComments() != null ? ticket.getComments().size() : 0);
        response.setAttachmentCount(ticket.getAttachments() != null ? ticket.getAttachments().size() : 0);

        return response;
    }

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

    private AttachmentResponse mapAttachmentToResponse(TicketAttachment attachment) {
        AttachmentResponse res = new AttachmentResponse();
        res.setId(attachment.getId());
        res.setFileUrl(attachment.getFileUrl());
        res.setFileName(attachment.getFileName());
        res.setContentType(attachment.getContentType());
        res.setFileSize(attachment.getFileSize());
        res.setUploadedById(attachment.getUploadedBy().getId());
        res.setUploadedByName(attachment.getUploadedBy().getName());
        res.setUploadedAt(attachment.getUploadedAt());
        return res;
    }
}
