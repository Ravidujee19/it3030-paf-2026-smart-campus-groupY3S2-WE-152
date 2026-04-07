package com.metricon.resource.repository;

import com.metricon.resource.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT r FROM Resource r WHERE " +
            "(:type IS NULL OR r.type = :type) AND " +
            "(:capacity IS NULL OR r.capacity >= :capacity) AND " +
            "(:location IS NULL OR LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%')))")
    List<Resource> findWithFilters(@org.springframework.data.repository.query.Param("type") Resource.ResourceType type, 
                                   @org.springframework.data.repository.query.Param("capacity") Integer capacity, 
                                   @org.springframework.data.repository.query.Param("location") String location);
}
