package com.college.bus.repository;

import com.college.bus.entity.Bus;
import com.college.bus.entity.BusStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    List<Bus> findByStatus(BusStatus status);
    List<Bus> findByRoute_RouteId(Long routeId);
    Optional<Bus> findByBusNo(String busNo);
}
