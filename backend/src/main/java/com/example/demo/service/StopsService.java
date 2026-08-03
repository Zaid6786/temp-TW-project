package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.models.Stops;

public interface StopsService {

    Stops saveStop(Stops stop);

    List<Stops> getAllStops();

    Optional<Stops> getStopById(Long id);

    Stops updateStop(Long id, Stops stop);

    void deleteStop(Long id);

}