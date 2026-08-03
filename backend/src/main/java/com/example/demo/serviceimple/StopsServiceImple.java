package com.example.demo.serviceimple;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Stops;
import com.example.demo.repository.StopsRepository;
import com.example.demo.service.StopsService;

@Service
public class StopsServiceImple implements StopsService {

    @Autowired
    private StopsRepository stopsRepository;

    @Override
    public Stops saveStop(Stops stop) {
        return stopsRepository.save(stop);
    }

    @Override
    public List<Stops> getAllStops() {
        return stopsRepository.findAll();
    }

    @Override
    public Optional<Stops> getStopById(Long id) {
        return stopsRepository.findById(id);
    }

    @Override
    public Stops updateStop(Long id, Stops stop) {

        Stops existingStop = stopsRepository.findById(id).orElse(null);

        if (existingStop != null) {

            existingStop.setRouteId(stop.getRouteId());
            existingStop.setStopName(stop.getStopName());
            existingStop.setLatitude(stop.getLatitude());
            existingStop.setLongitude(stop.getLongitude());
            existingStop.setSequence(stop.getSequence());
            existingStop.setIsMajorStop(stop.getIsMajorStop());

            return stopsRepository.save(existingStop);
        }

        return null;
    }

    @Override
    public void deleteStop(Long id) {
        stopsRepository.deleteById(id);
    }

}