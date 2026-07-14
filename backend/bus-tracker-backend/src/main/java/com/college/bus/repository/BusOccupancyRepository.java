package com.college.bus.repository;

import com.college.bus.entity.BusOccupancy;
import com.college.bus.entity.CrowdLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BusOccupancyRepository extends JpaRepository<BusOccupancy, Long> {
    Optional<BusOccupancy> findByBus_BusId(Long busId);
    List<BusOccupancy> findByCrowdLevel(CrowdLevel crowdLevel);
}
