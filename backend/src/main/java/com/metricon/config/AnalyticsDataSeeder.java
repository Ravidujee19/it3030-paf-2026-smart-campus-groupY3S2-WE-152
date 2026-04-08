package com.metricon.config;

import com.metricon.booking.entity.Booking;
import com.metricon.booking.repository.BookingRepository;
import com.metricon.resource.entity.Resource;
import com.metricon.resource.repository.ResourceRepository;
import com.metricon.user.entity.User;
import com.metricon.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class AnalyticsDataSeeder implements CommandLineRunner {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        if (bookingRepository.count() > 0) return;

        List<Resource> resources = resourceRepository.findAll();
        List<User> users = userRepository.findAll();

        if (resources.isEmpty() || users.isEmpty()) return;

        Random random = new Random();
        
        // Seed some random bookings for analytics
        for (int i = 0; i < 50; i++) {
            Resource resource = resources.get(random.nextInt(resources.size()));
            User user = users.get(random.nextInt(users.size()));
            
            // Random hour between 8 AM and 10 PM to show peaks
            int hour = 8 + random.nextInt(14); 
            LocalDateTime start = LocalDateTime.now().minusDays(random.nextInt(30))
                    .withHour(hour).withMinute(0);
            
            Booking booking = new Booking();
            booking.setResource(resource);
            booking.setUser(user);
            booking.setStartTime(start);
            booking.setEndTime(start.plusHours(1 + random.nextInt(3)));
            
            // Randomize status
            Booking.BookingStatus[] statuses = Booking.BookingStatus.values();
            booking.setStatus(statuses[random.nextInt(statuses.length)]);
            
            bookingRepository.save(booking);
        }
        
        System.out.println(">>> Analytics Data Seeded: 50 bookings created.");
    }
}
