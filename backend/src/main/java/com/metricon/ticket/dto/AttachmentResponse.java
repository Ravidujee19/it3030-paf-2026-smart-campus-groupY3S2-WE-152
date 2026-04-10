package com.metricon.ticket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttachmentResponse {
    private Long id;
    private String fileUrl;
    private String fileName;
    private String contentType;
    private Long fileSize;
    private Long uploadedById;
    private String uploadedByName;
    private LocalDateTime uploadedAt;
}
