package com.metricon.booking.repository;

import com.metricon.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b WHERE b.resource.id = :resourceId " +
           "AND b.status IN (com.metricon.booking.entity.Booking.BookingStatus.PENDING, com.metricon.booking.entity.Booking.BookingStatus.APPROVED, com.metricon.booking.entity.Booking.BookingStatus.CONFIRMED) " +
           "AND (:start < b.endTime AND :end > b.startTime)")
    List<Booking> findOverlappingBookings(
            @Param("resourceId") Long resourceId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    List<Booking> findByUserId(Long userId);

    @Query("SELECT b FROM Booking b WHERE (:status IS NULL OR b.status = :status)")
    List<Booking> findAllWithFilters(@Param("status") Booking.BookingStatus status);
}
