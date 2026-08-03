package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.models.FleetRouting;

public interface FleetRoutingService {

    FleetRouting saveFleetRouting(FleetRouting fleetRouting);

    List<FleetRouting> getAllFleetRoutings();

    Optional<FleetRouting> getFleetRoutingById(Long id);

    FleetRouting updateFleetRouting(Long id, FleetRouting fleetRouting);

    void deleteFleetRouting(Long id);

}