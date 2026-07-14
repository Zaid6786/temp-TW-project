package com.college.bus.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "driver")
@Data
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long driverId;
    
    private String name;
    private String phone;
    private String license;
    
    @Enumerated(EnumType.STRING)
    private DriverStatus status;
}
