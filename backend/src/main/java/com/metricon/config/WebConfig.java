package com.metricon.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

/**
 * Web Configuration to serve uploaded files (images) from the uploads directory.
 * Maps /uploads/** requests to the local file system uploads folder.
 * Also configures CORS to allow requests from frontend.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded files from the uploads directory
        String uploadDir = Paths.get("").toAbsolutePath().toString() + "/uploads/";
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadDir)
                .setCachePeriod(3600); // Cache for 1 hour
    }
}
