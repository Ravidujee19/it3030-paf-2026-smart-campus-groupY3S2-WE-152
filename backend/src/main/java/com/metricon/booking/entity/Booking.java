package com.metricon.booking.entity;

import com.metricon.resource.entity.Resource;
import com.metricon.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resource_id", nullable = false)
    private Resource resource;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = true)
    private String purpose;

    @Column(name = "expected_attendees")
    private Integer expectedAttendees;

    @Builder.Default
    private Boolean checkedIn = false;

    private LocalDateTime checkInTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private BookingStatus status;

    @Column(name = "reject_reason")
    private String rejectReason;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = BookingStatus.PENDING;
        }
    }

    public enum BookingStatus {
        PENDING, APPROVED, REJECTED, CANCELLED, CONFIRMED, COMPLETED
    }
}
