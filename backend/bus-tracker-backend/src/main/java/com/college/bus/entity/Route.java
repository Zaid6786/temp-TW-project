package com.college.bus.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "route")
@Data
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long routeId;
    
    @Column(nullable = false)
    private String routeName;
    
    @Column(unique = true, nullable = false)
    private String routeCode;
    
    private String startPoint;
    private String endPoint;
    private Double distance;
    private Integer expectedTime;
    private Boolean isActive;
    
    @OneToMany(mappedBy = "route")
    private List<Stop> stops;
}
