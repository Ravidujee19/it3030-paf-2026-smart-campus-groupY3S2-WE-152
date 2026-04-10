package com.metricon.resource.controller;

import com.metricon.resource.dto.ResourceDto;
import com.metricon.resource.service.ResourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping
    public ResponseEntity<List<ResourceDto>> getAllResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) String location) {
        
        if (type != null || capacity != null || location != null) {
            return ResponseEntity.ok(resourceService.searchResources(type, capacity, location));
        }
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceDto> getResourceById(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    @PostMapping
    public ResponseEntity<ResourceDto> createResource(@RequestBody ResourceDto resourceDto) {
        return ResponseEntity.ok(resourceService.createResource(resourceDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResourceDto> updateResource(@PathVariable Long id, @RequestBody ResourceDto resourceDto) {
        return ResponseEntity.ok(resourceService.updateResource(id, resourceDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
