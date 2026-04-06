package com.metricon.resource.repository;

import com.metricon.resource.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByType(Resource.ResourceType type);
    List<Resource> findByCapacityGreaterThanEqual(Integer capacity);
    List<Resource> findByLocationContainingIgnoreCase(String location);
}
