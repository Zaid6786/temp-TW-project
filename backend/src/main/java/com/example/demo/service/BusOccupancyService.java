package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.models.BusOccupancy;

public interface BusOccupancyService {

    BusOccupancy saveBusOccupancy(BusOccupancy busOccupancy);

    List<BusOccupancy> getAllBusOccupancies();

    Optional<BusOccupancy> getBusOccupancyById(Long id);

    BusOccupancy updateBusOccupancy(Long id, BusOccupancy busOccupancy);

    void deleteBusOccupancy(Long id);

}