package com.metricon.booking.controller;

import com.metricon.booking.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    public Map<String, Object> getAnalyticsSummary() {
        try {
            return Map.of(
                "topResources", analyticsService.getTopResources(),
                "peakHours", analyticsService.getPeakHours(),
                "stats", analyticsService.getDashboardStats()
            );
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
}
