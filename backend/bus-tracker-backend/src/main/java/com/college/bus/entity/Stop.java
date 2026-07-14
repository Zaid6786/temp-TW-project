package com.college.bus.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "stops")
@Data
public class Stop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stopId;
    
    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;
    
    private String stopName;
    private Double latitude;
    private Double longitude;
    private Integer sequence;
    private Boolean isMajorStop;
}
