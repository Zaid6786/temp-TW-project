package com.college.bus.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "bus_occupancy")
@Data
public class BusOccupancy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "bus_id")
    private Bus bus;
    
    private Integer occupied;
    private Integer available;
    private Double occupancyPercentage;
    
    @Enumerated(EnumType.STRING)
    private CrowdLevel crowdLevel;
    
    private LocalDateTime updatedTime;
    
    public void updateOccupancy(int occupied) {
        this.occupied = occupied;
        this.available = bus.getCapacity() - occupied;
        this.occupancyPercentage = (occupied * 100.0) / bus.getCapacity();
        this.crowdLevel = calculateCrowdLevel();
        this.updatedTime = LocalDateTime.now();
    }
    
    private CrowdLevel calculateCrowdLevel() {
        if (occupancyPercentage <= 40) return CrowdLevel.LOW;
        if (occupancyPercentage <= 70) return CrowdLevel.MEDIUM;
        return CrowdLevel.HIGH;
    }
}
