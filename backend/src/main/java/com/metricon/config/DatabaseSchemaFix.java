package com.metricon.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseSchemaFix implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Checking and updating database constraints...");
        try {
            // Drop the old constraint and add the updated one including all new enum values
            // The constraint name was identified as 'bookings_status_check' in the logs
            jdbcTemplate.execute("ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check");
            jdbcTemplate.execute("ALTER TABLE bookings ADD CONSTRAINT bookings_status_check " +
                                 "CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'CONFIRMED', 'COMPLETED'))");
            System.out.println("Database constraints updated successfully.");
        } catch (Exception e) {
            System.err.println("Note: Could not update constraints automatically: " + e.getMessage());
        }
    }
}
