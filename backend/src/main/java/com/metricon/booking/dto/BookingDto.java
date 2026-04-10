package com.metricon.booking.dto;

import com.metricon.booking.entity.Booking;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDto {
    private Long id;

    @NotNull(message = "Resource ID is required")
    private Long resourceId;

    private String resourceName;
    private Long userId;
    private String userName;

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    private LocalDateTime endTime;

    @NotNull(message = "Purpose is required")
    private String purpose;

    private Integer expectedAttendees;
    private Booking.BookingStatus status;
    private String rejectReason;
    private Boolean checkedIn;
    private LocalDateTime checkInTime;
    private LocalDateTime createdAt;
}
