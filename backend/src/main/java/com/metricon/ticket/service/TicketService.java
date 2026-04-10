package com.metricon.ticket.service;

import com.metricon.common.enums.NotificationType;
import com.metricon.common.exception.InvalidStatusTransitionException;
import com.metricon.common.exception.ResourceNotFoundException;
import com.metricon.notification.service.NotificationService;
import com.metricon.ticket.entity.Ticket;
import com.metricon.ticket.entity.TicketAttachment;
import com.metricon.ticket.entity.TicketStatus;
import com.metricon.ticket.repository.TicketRepository;
import com.metricon.ticket.repository.TicketAttachmentRepository;
import com.metricon.user.entity.User;
import com.metricon.user.repository.UserRepository;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketAttachmentRepository attachmentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final FileStorageService fileStorageService;

    private static final Map<TicketStatus, Set<TicketStatus>> ALLOWED_TRANSITIONS = Map.of(
            TicketStatus.OPEN, Set.of(TicketStatus.IN_PROGRESS, TicketStatus.REJECTED),
            TicketStatus.IN_PROGRESS, Set.of(TicketStatus.RESOLVED, TicketStatus.REJECTED),
            TicketStatus.RESOLVED, Set.of(TicketStatus.CLOSED, TicketStatus.REJECTED),
            TicketStatus.CLOSED, Set.of(),
            TicketStatus.REJECTED, Set.of()
    );

    public TicketService(TicketRepository ticketRepository,
                         TicketAttachmentRepository attachmentRepository,
                         UserRepository userRepository,
                         NotificationService notificationService,
                         FileStorageService fileStorageService) {
        this.ticketRepository = ticketRepository;
        this.attachmentRepository = attachmentRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public Ticket createTicket(Ticket ticket, Long creatorUserId) {
        User creator = userRepository.findById(creatorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", creatorUserId));

        ticket.setCreatedBy(creator);
        ticket.setStatus(TicketStatus.OPEN);

        return ticketRepository.save(ticket);
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", id));
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getTicketsByCreator(Long userId) {
        return ticketRepository.findByCreatedById(userId);
    }

    public List<Ticket> getTicketsByAssignee(Long technicianId) {
        return ticketRepository.findByAssignedToId(technicianId);
    }

    public List<Ticket> getTicketsByStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status);
    }

    @Transactional
    public Ticket updateTicketStatus(Long ticketId, TicketStatus newStatus) {
        Ticket ticket = getTicketById(ticketId);
        TicketStatus currentStatus = ticket.getStatus();

        // Validate the transition
        if (!isTransitionAllowed(currentStatus, newStatus)) {
            throw new InvalidStatusTransitionException(currentStatus.name(), newStatus.name());
        }

        ticket.setStatus(newStatus);

        // Set lifecycle timestamps
        if (newStatus == TicketStatus.RESOLVED) {
            ticket.setResolvedAt(LocalDateTime.now());
        } else if (newStatus == TicketStatus.CLOSED) {
            ticket.setClosedAt(LocalDateTime.now());
        }

        Ticket saved = ticketRepository.save(ticket);

        // Notify ticket creator about the status change
        if (ticket.getCreatedBy() != null) {
            String ownerEmail = ticket.getCreatedBy().getEmail();
            String statusLabel = newStatus.name().replace("_", " ");
            notificationService.createNotification(
                    ownerEmail,
                    "Ticket Status Updated",
                    "Your ticket \"" + ticket.getTitle() + "\" has been updated to: " + statusLabel + ".",
                    resolveTypeForStatus(newStatus)
            );
        }

        return saved;
    }

    @Transactional
    public Ticket assignTechnician(Long ticketId, Long technicianId) {
        Ticket ticket = getTicketById(ticketId);
        User technician = userRepository.findById(technicianId)
                .orElseThrow(() -> new ResourceNotFoundException("User", technicianId));

        ticket.setAssignedTo(technician);
        Ticket saved = ticketRepository.save(ticket);

        // Notify the assigned technician
        notificationService.createNotification(
                technician.getEmail(),
                "Ticket Assigned to You",
                "You have been assigned to ticket: \"" + ticket.getTitle() + "\". Please review and take action.",
                NotificationType.INFO
        );

        return saved;
    }

    @Transactional
    public Ticket addResolutionNotes(Long ticketId, String notes) {
        Ticket ticket = getTicketById(ticketId);
        ticket.setResolutionNotes(notes);

        return ticketRepository.save(ticket);
    }

    @Transactional
    public Ticket updateTicket(Long ticketId, Ticket updatedFields) {
        Ticket ticket = getTicketById(ticketId);

        if (updatedFields.getTitle() != null) {
            ticket.setTitle(updatedFields.getTitle());
        }
        if (updatedFields.getDescription() != null) {
            ticket.setDescription(updatedFields.getDescription());
        }
        if (updatedFields.getCategory() != null) {
            ticket.setCategory(updatedFields.getCategory());
        }
        if (updatedFields.getPriority() != null) {
            ticket.setPriority(updatedFields.getPriority());
        }
        if (updatedFields.getLocation() != null) {
            ticket.setLocation(updatedFields.getLocation());
        }
        if (updatedFields.getResourceName() != null) {
            ticket.setResourceName(updatedFields.getResourceName());
        }
        if (updatedFields.getContactEmail() != null) {
            ticket.setContactEmail(updatedFields.getContactEmail());
        }
        if (updatedFields.getContactPhone() != null) {
            ticket.setContactPhone(updatedFields.getContactPhone());
        }

        return ticketRepository.save(ticket);
    }

    @Transactional
    public void deleteTicket(Long ticketId) {
        Ticket ticket = getTicketById(ticketId);
        
        // Delete associated files
        if (ticket.getAttachments() != null) {
            ticket.getAttachments().forEach(att -> fileStorageService.deleteFile(att.getFileUrl()));
        }
        
        ticketRepository.delete(ticket);
    }

    @Transactional
    public List<TicketAttachment> addAttachments(Long ticketId, MultipartFile[] files, Long uploaderId) {
        Ticket ticket = getTicketById(ticketId);
        User uploader = userRepository.findById(uploaderId)
                .orElseThrow(() -> new ResourceNotFoundException("User", uploaderId));

        int currentCount = ticket.getAttachments() != null ? ticket.getAttachments().size() : 0;
        if (currentCount + files.length > 3) {
            throw new IllegalArgumentException("A ticket can have a maximum of 3 attachments.");
        }

        List<TicketAttachment> savedAttachments = new java.util.ArrayList<>();
        for (MultipartFile file : files) {
            String fileUrl = fileStorageService.storeFile(file, ticketId);

            TicketAttachment attachment = new TicketAttachment();
            attachment.setTicket(ticket);
            attachment.setUploadedBy(uploader);
            attachment.setFileName(org.springframework.util.StringUtils.cleanPath(file.getOriginalFilename()));
            attachment.setFileUrl(fileUrl);
            attachment.setContentType(file.getContentType());
            attachment.setFileSize(file.getSize());

            savedAttachments.add(attachmentRepository.save(attachment));
        }

        return savedAttachments;
    }

    public List<TicketAttachment> getAttachments(Long ticketId) {
        Ticket ticket = getTicketById(ticketId);
        return ticket.getAttachments();
    }

    @Transactional
    public void deleteAttachment(Long attachmentId, Long userId, boolean isAdmin) {
        TicketAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment", attachmentId));

        if (!isAdmin && !attachment.getUploadedBy().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("You are not authorized to delete this attachment.");
        }

        // Delete from local filesystem
        fileStorageService.deleteFile(attachment.getFileUrl());

        // Delete from database
        attachmentRepository.delete(attachment);
    }

    private boolean isTransitionAllowed(TicketStatus currentStatus, TicketStatus newStatus) {
        Set<TicketStatus> allowed = ALLOWED_TRANSITIONS.get(currentStatus);
        return allowed != null && allowed.contains(newStatus);
    }

    private NotificationType resolveTypeForStatus(TicketStatus status) {
        return switch (status) {
            case RESOLVED, CLOSED -> NotificationType.SUCCESS;
            case REJECTED -> NotificationType.ERROR;
            case IN_PROGRESS -> NotificationType.INFO;
            default -> NotificationType.WARNING;
        };
    }
}
