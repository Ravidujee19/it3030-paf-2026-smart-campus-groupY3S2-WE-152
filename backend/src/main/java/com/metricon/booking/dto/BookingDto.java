package com.metricon.booking.dto;

import com.metricon.booking.entity.Booking;
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
    private Long resourceId;
    private String resourceName;
    private Long userId;
    private String userName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String purpose;
    private Integer expectedAttendees;
    private Booking.BookingStatus status;
    private String rejectReason;
    private Boolean checkedIn;
    private LocalDateTime checkInTime;
    private LocalDateTime createdAt;
}
