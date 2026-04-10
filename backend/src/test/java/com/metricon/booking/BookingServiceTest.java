package com.metricon.booking;

import com.metricon.booking.dto.BookingDto;
import com.metricon.booking.entity.Booking;
import com.metricon.booking.repository.BookingRepository;
import com.metricon.booking.service.BookingService;
import com.metricon.notification.service.NotificationService;
import com.metricon.resource.entity.Resource;
import com.metricon.resource.repository.ResourceRepository;
import com.metricon.user.entity.User;
import com.metricon.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private ResourceRepository resourceRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private BookingService bookingService;

    private User sampleUser;
    private Resource sampleResource;
    private Booking sampleBooking;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setEmail("user@ex.com");

        sampleResource = new Resource();
        sampleResource.setId(10L);
        sampleResource.setName("Room A");
        sampleResource.setStatus(Resource.ResourceStatus.ACTIVE);

        sampleBooking = new Booking();
        sampleBooking.setId(100L);
        sampleBooking.setUser(sampleUser);
        sampleBooking.setResource(sampleResource);
        sampleBooking.setStatus(Booking.BookingStatus.PENDING);
        sampleBooking.setStartTime(LocalDateTime.now().plusDays(1));
        sampleBooking.setEndTime(LocalDateTime.now().plusDays(1).plusHours(2));
    }

    @Test
    void createBooking_Success() {
        BookingDto dto = new BookingDto();
        dto.setResourceId(10L);
        dto.setStartTime(sampleBooking.getStartTime());
        dto.setEndTime(sampleBooking.getEndTime());

        when(resourceRepository.findById(10L)).thenReturn(Optional.of(sampleResource));
        when(bookingRepository.findOverlappingBookings(eq(10L), any(), any())).thenReturn(Collections.emptyList());
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(bookingRepository.save(any(Booking.class))).thenReturn(sampleBooking);

        BookingDto result = bookingService.createBooking(dto, 1L);

        assertNotNull(result);
        assertEquals(Booking.BookingStatus.PENDING, result.getStatus());
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    void createBooking_Conflict_Throws() {
        BookingDto dto = new BookingDto();
        dto.setResourceId(10L);

        when(resourceRepository.findById(10L)).thenReturn(Optional.of(sampleResource));
        when(bookingRepository.findOverlappingBookings(eq(10L), any(), any())).thenReturn(List.of(new Booking()));

        assertThrows(ResponseStatusException.class, () -> bookingService.createBooking(dto, 1L));
    }

    @Test
    void reviewBooking_Approve_Success() {
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(sampleBooking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(sampleBooking);

        BookingDto result = bookingService.reviewBooking(100L, Booking.BookingStatus.APPROVED, null);

        assertEquals(Booking.BookingStatus.APPROVED, result.getStatus());
    }

    @Test
    void reviewBooking_RejectWithoutReason_Throws() {
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(sampleBooking));

        assertThrows(ResponseStatusException.class, 
                () -> bookingService.reviewBooking(100L, Booking.BookingStatus.REJECTED, ""));
    }

    @Test
    void cancelBooking_Owner_Success() {
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(sampleBooking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(sampleBooking);

        BookingDto result = bookingService.cancelBooking(100L, 1L, false);

        assertEquals(Booking.BookingStatus.CANCELLED, result.getStatus());
    }

    @Test
    void cancelBooking_NotOwner_Throws() {
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(sampleBooking));

        assertThrows(RuntimeException.class, () -> bookingService.cancelBooking(100L, 2L, false));
    }

    @Test
    void checkInBooking_Success() {
        sampleBooking.setStatus(Booking.BookingStatus.APPROVED);
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(sampleBooking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(sampleBooking);

        BookingDto result = bookingService.checkInBooking(100L);

        assertTrue(result.getCheckedIn());
        assertEquals(Booking.BookingStatus.CONFIRMED, result.getStatus());
    }
}
