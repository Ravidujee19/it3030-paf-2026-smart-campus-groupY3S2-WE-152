package com.metricon.resource.dto;

import com.metricon.resource.entity.Resource.ResourceStatus;
import com.metricon.resource.entity.Resource.ResourceType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceDto {
    private Long id;
    private String name;
    private ResourceType type;
    private Integer capacity;
    private String location;
    private String availabilityWindows;
    private ResourceStatus status;
}
