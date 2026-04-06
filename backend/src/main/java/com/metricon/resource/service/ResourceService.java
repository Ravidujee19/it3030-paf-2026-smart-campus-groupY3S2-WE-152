package com.metricon.resource.service;

import com.metricon.resource.dto.ResourceDto;
import com.metricon.resource.entity.Resource;
import com.metricon.resource.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public List<ResourceDto> getAllResources() {
        return resourceRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ResourceDto getResourceById(Long id) {
        Resource resource = resourceRepository.findById(id).orElseThrow(() -> new RuntimeException("Resource not found"));
        return mapToDto(resource);
    }

    public List<ResourceDto> searchResources(String type, Integer capacity, String location) {
        List<Resource> resources = resourceRepository.findAll();
        
        if (type != null && !type.isEmpty()) {
            resources = resources.stream()
                .filter(r -> r.getType().name().equalsIgnoreCase(type))
                .collect(Collectors.toList());
        }
        if (capacity != null) {
            resources = resources.stream()
                .filter(r -> r.getCapacity() >= capacity)
                .collect(Collectors.toList());
        }
        if (location != null && !location.isEmpty()) {
            resources = resources.stream()
                .filter(r -> r.getLocation().toLowerCase().contains(location.toLowerCase()))
                .collect(Collectors.toList());
        }

        return resources.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ResourceDto createResource(ResourceDto dto) {
        Resource resource = mapToEntity(dto);
        return mapToDto(resourceRepository.save(resource));
    }

    public ResourceDto updateResource(Long id, ResourceDto dto) {
        Resource existing = resourceRepository.findById(id).orElseThrow(() -> new RuntimeException("Resource not found"));
        existing.setName(dto.getName());
        existing.setType(dto.getType());
        existing.setCapacity(dto.getCapacity());
        existing.setLocation(dto.getLocation());
        existing.setAvailabilityWindows(dto.getAvailabilityWindows());
        existing.setStatus(dto.getStatus());
        return mapToDto(resourceRepository.save(existing));
    }

    public void deleteResource(Long id) {
        resourceRepository.deleteById(id);
    }

    private ResourceDto mapToDto(Resource resource) {
        return new ResourceDto(
                resource.getId(),
                resource.getName(),
                resource.getType(),
                resource.getCapacity(),
                resource.getLocation(),
                resource.getAvailabilityWindows(),
                resource.getStatus()
        );
    }

    private Resource mapToEntity(ResourceDto dto) {
        Resource resource = new Resource();
        resource.setId(dto.getId());
        resource.setName(dto.getName());
        resource.setType(dto.getType());
        resource.setCapacity(dto.getCapacity());
        resource.setLocation(dto.getLocation());
        resource.setAvailabilityWindows(dto.getAvailabilityWindows());
        resource.setStatus(dto.getStatus());
        return resource;
    }
}
