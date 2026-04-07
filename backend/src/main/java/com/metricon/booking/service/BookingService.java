package com.metricon.booking.service;

import com.metricon.booking.dto.BookingDto;
import com.metricon.booking.entity.Booking;
import com.metricon.booking.repository.BookingRepository;
import com.metricon.resource.entity.Resource;
import com.metricon.resource.repository.ResourceRepository;
import com.metricon.user.entity.User;
import com.metricon.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;

    @Transactional
    public BookingDto createBooking(BookingDto dto, Long userId) {
        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found"));

        if (resource.getStatus() != Resource.ResourceStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Resource is currently out of service");
        }

        // Check for overlaps
        List<Booking> overlaps = bookingRepository.findOverlappingBookings(
                dto.getResourceId(), 
                dto.getStartTime(), 
                dto.getEndTime()
        );

        if (!overlaps.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Scheduling conflict: The resource is already booked for this time range.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Booking booking = Booking.builder()
                .resource(resource)
                .user(user)
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .purpose(dto.getPurpose())
                .expectedAttendees(dto.getExpectedAttendees())
                .status(Booking.BookingStatus.PENDING)
                .build();

        return mapToDto(bookingRepository.save(booking));
    }

    @Transactional
    public BookingDto reviewBooking(Long bookingId, Booking.BookingStatus newStatus, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be approved or rejected.");
        }

        if (newStatus == Booking.BookingStatus.REJECTED && (reason == null || reason.trim().isEmpty())) {
            throw new RuntimeException("A reason must be provided when rejecting a booking.");
        }

        booking.setStatus(newStatus);
        booking.setRejectReason(reason);

        return mapToDto(bookingRepository.save(booking));
    }

    @Transactional
    public BookingDto cancelBooking(Long bookingId, Long userId, boolean isAdmin) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!isAdmin && !booking.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You can only cancel your own bookings.");
        }

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED || booking.getStatus() == Booking.BookingStatus.REJECTED) {
            throw new RuntimeException("Booking is already inactive.");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        return mapToDto(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public List<BookingDto> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingDto> getAllBookings(Booking.BookingStatus status) {
        return bookingRepository.findAllWithFilters(status).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private BookingDto mapToDto(Booking entity) {
        if (entity == null) return null;
        
        return BookingDto.builder()
                .id(entity.getId())
                .resourceId(entity.getResource() != null ? entity.getResource().getId() : null)
                .resourceName(entity.getResource() != null ? entity.getResource().getName() : "Unknown Resource")
                .userId(entity.getUser() != null ? entity.getUser().getId() : null)
                .userName(entity.getUser() != null ? entity.getUser().getName() : "Unknown User")
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .purpose(entity.getPurpose())
                .expectedAttendees(entity.getExpectedAttendees())
                .status(entity.getStatus())
                .rejectReason(entity.getRejectReason())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
