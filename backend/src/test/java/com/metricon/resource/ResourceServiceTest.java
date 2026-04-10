package com.metricon.resource;

import com.metricon.common.exception.ResourceNotFoundException;
import com.metricon.resource.dto.ResourceDto;
import com.metricon.resource.entity.Resource;
import com.metricon.resource.repository.ResourceRepository;
import com.metricon.resource.service.ResourceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.metricon.notification.service.NotificationService;
import com.metricon.user.repository.UserRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResourceServiceTest {

    @Mock
    private ResourceRepository resourceRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ResourceService resourceService;

    private Resource sampleResource;

    @BeforeEach
    void setUp() {
        sampleResource = new Resource();
        sampleResource.setId(1L);
        sampleResource.setName("Test Lab");
        sampleResource.setType(Resource.ResourceType.LAB);
        sampleResource.setCapacity(30);
        sampleResource.setStatus(Resource.ResourceStatus.ACTIVE);
    }

    @Test
    void createResource_Success() {
        when(resourceRepository.save(any(Resource.class))).thenReturn(sampleResource);

        ResourceDto dto = new ResourceDto();
        dto.setName("Test Lab");
        dto.setType(Resource.ResourceType.LAB);
        dto.setCapacity(30);

        ResourceDto created = resourceService.createResource(dto);

        assertNotNull(created);
        assertEquals("Test Lab", created.getName());
        verify(resourceRepository, times(1)).save(any(Resource.class));
    }

    @Test
    void getResourceById_Found() {
        when(resourceRepository.findById(1L)).thenReturn(Optional.of(sampleResource));

        ResourceDto found = resourceService.getResourceById(1L);

        assertNotNull(found);
        assertEquals(1L, found.getId());
    }

    @Test
    void getResourceById_NotFound() {
        when(resourceRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> resourceService.getResourceById(99L));
    }

    @Test
    void updateResource_Success() {
        when(resourceRepository.findById(1L)).thenReturn(Optional.of(sampleResource));
        when(resourceRepository.save(any(Resource.class))).thenReturn(sampleResource);

        ResourceDto updateFields = new ResourceDto();
        updateFields.setName("Updated Lab");

        ResourceDto updated = resourceService.updateResource(1L, updateFields);

        assertNotNull(updated);
        verify(resourceRepository, times(1)).save(sampleResource);
    }

    @Test
    void deleteResource_Success() {
        doNothing().when(resourceRepository).deleteById(1L);

        assertDoesNotThrow(() -> resourceService.deleteResource(1L));
        verify(resourceRepository, times(1)).deleteById(1L);
    }
}
