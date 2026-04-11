package com.metricon.booking.service;

import com.metricon.booking.entity.Booking;
import com.metricon.booking.repository.BookingRepository;
import com.metricon.resource.entity.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

@Service // anlaytics handlee, business logic
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private final BookingRepository bookingRepository;

    public Map<String, Long> getTopResources() { // get top 5 most booked resources
        List<Booking> allBookings = bookingRepository.findAll();// grt all data
        return allBookings.stream()
                .filter(b -> b.getResource() != null && b.getResource().getName() != null) // removing all null
                .collect(Collectors.groupingBy(b -> b.getResource().getName(), Collectors.counting())) // group by
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed()) // sort
                .limit(5)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new));
    }

    public Map<Integer, Long> getPeakHours() { // analyzes booking start times and counts how many bookings begin in
                                               // each hour.
        List<Booking> allBookings = bookingRepository.findAll();
        Map<Integer, Long> hourCounts = allBookings.stream()
                .filter(b -> b.getStartTime() != null)
                .collect(Collectors.groupingBy(b -> b.getStartTime().getHour(), Collectors.counting()));

        Map<Integer, Long> completeHours = new java.util.TreeMap<>();
        for (int i = 0; i < 24; i++) {
            completeHours.put(i, hourCounts.getOrDefault(i, 0L));
        }
        return completeHours;
    }

    /**
     * Generates a 7x24 heatmap of booking density.
     * 
     * @return Map where key is DayOfWeek (1-7) and value is an array of 24 hourly
     *         intensities.
     */
    public Map<String, List<Long>> getBookingHeatmap() {
        List<Booking> allBookings = bookingRepository.findAll();
        Map<String, long[]> grid = new LinkedHashMap<>();

        for (DayOfWeek day : DayOfWeek.values()) {
            grid.put(day.name(), new long[24]);
        }

        for (Booking b : allBookings) {
            if (b.getStartTime() != null && b.getStatus() != Booking.BookingStatus.CANCELLED) {
                String day = b.getStartTime().getDayOfWeek().name();
                int hour = b.getStartTime().getHour();
                grid.get(day)[hour]++;
            }
        }

        Map<String, List<Long>> result = new LinkedHashMap<>();
        grid.forEach((day, hours) -> {
            List<Long> hourList = new ArrayList<>();
            for (long h : hours)
                hourList.add(h);
            result.put(day, hourList);
        });
        return result;
    }

    public Map<String, Long> getLocationAnalytics() { // This counts bookings by location.
        return bookingRepository.findAll().stream()
                .filter(b -> b.getResource() != null && b.getResource().getLocation() != null)
                .collect(Collectors.groupingBy(b -> b.getResource().getLocation(), Collectors.counting()));
    }

    public Map<String, Double> getCapacityEfficiency() { // Calculates efficiency as (actual attendees / capacity) *
                                                         // 100.
        List<Booking> bookings = bookingRepository.findAll();
        Map<String, List<Double>> efficiencyByResource = new HashMap<>();

        for (Booking b : bookings) {
            Resource r = b.getResource();
            if (r != null && r.getCapacity() != null && b.getExpectedAttendees() != null && r.getCapacity() > 0) {
                double efficiency = (double) b.getExpectedAttendees() / r.getCapacity() * 100;
                efficiencyByResource.computeIfAbsent(r.getName(), k -> new ArrayList<>()).add(efficiency);
            }
        }

        return efficiencyByResource.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> e.getValue().stream().mapToDouble(Double::doubleValue).average().orElse(0.0)));
    }

    public List<Map<String, String>> getSmartInsights() { // generates recommendation messages
        List<Map<String, String>> insights = new ArrayList<>();
        List<Booking> bookings = bookingRepository.findAll();

        if (bookings.isEmpty())
            return insights;

        // Insight 1: Peak utilization detector
        Map<Integer, Long> peakHours = getPeakHours();
        int maxHour = peakHours.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(0);

        if (peakHours.get(maxHour) > 5) {
            insights.add(Map.of(
                    "type", "CAPACITY",
                    "message",
                    String.format("High demand detected around %02d:00. Recommend load balancing scheduled sessions.",
                            maxHour),
                    "severity", "WARNING"));
        }

        // Insight 2: Underutilized Resource Identification
        Map<String, Long> resourceCounts = bookings.stream()
                .filter(b -> b.getResource() != null)
                .collect(Collectors.groupingBy(b -> b.getResource().getName(), Collectors.counting()));

        resourceCounts.entrySet().stream()
                .filter(e -> e.getValue() < 2)
                .findFirst()
                .ifPresent(e -> insights.add(Map.of(
                        "type", "OPTIMIZATION",
                        "message",
                        String.format("Resource '%s' has low utilization. Consider repurposing or maintenance.",
                                e.getKey()),
                        "severity", "INFO")));

        return insights;
    }

    public Map<String, Object> getDashboardStats() { // This provides the top summary cards.
        List<Booking> allBookings = bookingRepository.findAll();
        Map<String, Object> stats = new java.util.HashMap<>();

        long total = allBookings.size();
        long active = allBookings.stream().filter(b -> b.getStatus() == Booking.BookingStatus.APPROVED
                || b.getStatus() == Booking.BookingStatus.CONFIRMED).count();
        long pending = allBookings.stream().filter(b -> b.getStatus() == Booking.BookingStatus.PENDING).count();

        stats.put("totalBookings", total);
        stats.put("activeBookings", active);
        stats.put("pendingBookings", pending);

        // Calculate a simple day-over-day trend (dummy logic for visual demo, would use
        // timestamps in prod)
        stats.put("utilizationTrend", "+12.5%");
        stats.put("efficiencyRate", "84%");

        return stats;
    }
}
// maps and lists because analytics data is naturally grouped