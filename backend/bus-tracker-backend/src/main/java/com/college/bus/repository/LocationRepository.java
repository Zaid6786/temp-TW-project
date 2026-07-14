package com.college.bus.repository;

import com.college.bus.entity.BusLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<BusLocation, Long> {
    List<BusLocation> findByBus_BusIdOrderByTimestampDesc(Long busId);
    Optional<BusLocation> findTopByBus_BusIdOrderByTimestampDesc(Long busId);
}
