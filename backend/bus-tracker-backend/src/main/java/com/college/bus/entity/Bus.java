package com.college.bus.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "bus")
@Data
public class Bus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long busId;
    
    @Column(unique = true, nullable = false)
    private String busNo;
    
    @Column(unique = true, nullable = false)
    private String registrationNumber;
    
    private Integer capacity;
    
    private Double currentLat;
    private Double currentLng;
    
    @Enumerated(EnumType.STRING)
    private BusStatus status;
    
    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;
    
    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;
    
    private Double speed;
    private String currentStop;
    private String nextStop;
    
    @OneToOne(mappedBy = "bus", cascade = CascadeType.ALL)
    private BusOccupancy occupancy;
    
    @OneToMany(mappedBy = "bus")
    private List<BusLocation> locations;
}
