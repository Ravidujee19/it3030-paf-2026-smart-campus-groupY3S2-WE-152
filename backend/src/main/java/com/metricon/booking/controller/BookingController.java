package com.metricon.booking.controller;

import com.metricon.booking.dto.BookingDto;
import com.metricon.booking.entity.Booking;
import com.metricon.booking.service.BookingService;
import com.metricon.user.entity.User;
import com.metricon.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    // --- User Endpoints ---

    @PostMapping("/request")
    @PreAuthorize("hasAnyRole('STAFF', 'TECHNICIAN', 'ADMIN')")
    public ResponseEntity<BookingDto> requestBooking(
            @RequestBody BookingDto dto,
            @AuthenticationPrincipal OAuth2User principal
    ) {
        try {
            User user = userRepository.findByEmail(principal.getAttribute("email"))
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(bookingService.createBooking(dto, user.getId()));
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('STAFF', 'TECHNICIAN', 'ADMIN')")
    public ResponseEntity<List<BookingDto>> getMyBookings(@AuthenticationPrincipal OAuth2User principal) {
        try {
            User user = userRepository.findByEmail(principal.getAttribute("email"))
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(bookingService.getUserBookings(user.getId()));
        } catch (Exception e) {
            e.printStackTrace(); // Log detailed error
            throw e;
        }
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('STAFF', 'TECHNICIAN', 'ADMIN')")
    public ResponseEntity<BookingDto> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal OAuth2User principal
    ) {
        User user = userRepository.findByEmail(principal.getAttribute("email"))
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return ResponseEntity.ok(bookingService.cancelBooking(id, user.getId(), isAdmin));
    }

    // --- Admin Endpoints ---

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingDto>> getAllBookings(
            @RequestParam(required = false) Booking.BookingStatus status
    ) {
        return ResponseEntity.ok(bookingService.getAllBookings(status));
    }

    @PostMapping("/{id}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingDto> reviewBooking(
            @PathVariable Long id,
            @RequestBody Map<String, String> request
    ) {
        Booking.BookingStatus status = Booking.BookingStatus.valueOf(request.get("status").toUpperCase());
        String reason = request.get("reason");
        return ResponseEntity.ok(bookingService.reviewBooking(id, status, reason));
    }

    @PostMapping("/{id}/check-in")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<BookingDto> checkInBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.checkInBooking(id));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<BookingDto> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }
}
