package com.metricon.booking.service;

import com.metricon.booking.entity.Booking;
import com.metricon.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final BookingRepository bookingRepository;

    public Map<String, Long> getTopResources() {
        List<Booking> allBookings = bookingRepository.findAll();
        
        // Count bookings per resource name
        return allBookings.stream()
                .collect(Collectors.groupingBy(b -> b.getResource().getName(), Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
    }

    public Map<Integer, Long> getPeakHours() {
        List<Booking> allBookings = bookingRepository.findAll();
        
        // Count bookings per start hour (0-23)
        Map<Integer, Long> hourCounts = allBookings.stream()
                .collect(Collectors.groupingBy(b -> b.getStartTime().getHour(), Collectors.counting()));
                
        // Ensure all hours are represented for a complete chart if needed
        Map<Integer, Long> completeHours = new java.util.TreeMap<>();
        for (int i = 0; i < 24; i++) {
            completeHours.put(i, hourCounts.getOrDefault(i, 0L));
        }
        return completeHours;
    }

    public Map<String, Object> getDashboardStats() {
        List<Booking> allBookings = bookingRepository.findAll();
        Map<String, Object> stats = new java.util.HashMap<>();
        
        stats.put("totalBookings", (long) allBookings.size());
        stats.put("activeBookings", allBookings.stream().filter(b -> b.getStatus() == Booking.BookingStatus.APPROVED || b.getStatus() == Booking.BookingStatus.CONFIRMED).count());
        stats.put("pendingBookings", allBookings.stream().filter(b -> b.getStatus() == Booking.BookingStatus.PENDING).count());
        
        return stats;
    }
}
