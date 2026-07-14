package com.college.bus.service;

import com.college.bus.entity.*;
import com.college.bus.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import lombok.Data;

@Service
@Transactional
public class BusService {
    @Autowired
    private BusRepository busRepository;
    
    @Autowired
    private BusOccupancyRepository occupancyRepository;
    
    @Autowired
    private LocationRepository locationRepository;
    
    public Bus createBus(Bus bus) {
        Bus savedBus = busRepository.save(bus);
        
        // Create initial occupancy record
        BusOccupancy occupancy = new BusOccupancy();
        occupancy.setBus(savedBus);
        occupancy.updateOccupancy(0);
        occupancyRepository.save(occupancy);
        
        return savedBus;
    }
    
    public Bus updateBus(Long busId, Bus busDetails) {
        Optional<Bus> busOpt = busRepository.findById(busId);
        if (busOpt.isPresent()) {
            Bus bus = busOpt.get();
            bus.setBusNo(busDetails.getBusNo());
            bus.setRegistrationNumber(busDetails.getRegistrationNumber());
            bus.setCapacity(busDetails.getCapacity());
            bus.setStatus(busDetails.getStatus());
            bus.setDriver(busDetails.getDriver());
            bus.setRoute(busDetails.getRoute());
            return busRepository.save(bus);
        }
        return null;
    }
    
    public void deleteBus(Long busId) {
        busRepository.deleteById(busId);
    }
    
    public BusLocation updateBusLocation(Long busId, BusLocation location) {
        Optional<Bus> busOpt = busRepository.findById(busId);
        if (busOpt.isPresent()) {
            Bus bus = busOpt.get();
            location.setBus(bus);
            BusLocation savedLocation = locationRepository.save(location);
            
            // Update bus current location
            bus.setCurrentLat(location.getLatitude());
            bus.setCurrentLng(location.getLongitude());
            bus.setSpeed(location.getSpeed());
            busRepository.save(bus);
            
            return savedLocation;
        }
        return null;
    }
    
    public BusLocation getLatestLocation(Long busId) {
        return locationRepository.findTopByBus_BusIdOrderByTimestampDesc(busId).orElse(null);
    }
    
    public BusOccupancy updateOccupancy(Long busId, int occupied) {
        Optional<Bus> busOpt = busRepository.findById(busId);
        if (busOpt.isPresent()) {
            Bus bus = busOpt.get();
            BusOccupancy occupancy = occupancyRepository.findByBus_BusId(busId).orElse(null);
            
            if (occupancy == null) {
                occupancy = new BusOccupancy();
                occupancy.setBus(bus);
            }
            
            occupancy.updateOccupancy(occupied);
            return occupancyRepository.save(occupancy);
        }
        return null;
    }
    
    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }
    
    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();
        stats.setTotalBuses(busRepository.count());
        stats.setActiveBuses(busRepository.findByStatus(BusStatus.ACTIVE).size());
        stats.setMaintenanceBuses(busRepository.findByStatus(BusStatus.MAINTENANCE).size());
        
        // Calculate average occupancy
        List<BusOccupancy> occupancies = occupancyRepository.findAll();
        double avgOccupancy = occupancies.stream()
            .filter(o -> o.getOccupancyPercentage() != null)
            .mapToDouble(BusOccupancy::getOccupancyPercentage)
            .average()
            .orElse(0);
        stats.setAverageOccupancy(avgOccupancy);
        
        stats.setDelayedBuses(0);
        
        return stats;
    }
    
    @Data
    public static class DashboardStats {
        private long totalBuses;
        private int activeBuses;
        private int maintenanceBuses;
        private double averageOccupancy;
        private int delayedBuses;
    }
}
