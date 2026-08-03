package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.models.BusOccupancy;
import com.example.demo.service.BusOccupancyService;

@RestController
@RequestMapping("/busoccupancy")
@CrossOrigin(origins = "*")
public class BusOccupancyController {

    @Autowired
    private BusOccupancyService busOccupancyService;

    // Save Bus Occupancy
    @PostMapping("/save")
    public BusOccupancy saveBusOccupancy(@RequestBody BusOccupancy busOccupancy) {
        return busOccupancyService.saveBusOccupancy(busOccupancy);
    }

    // Get All Bus Occupancies
    @GetMapping("/getall")
    public List<BusOccupancy> getAllBusOccupancies() {
        return busOccupancyService.getAllBusOccupancies();
    }

    // Get Bus Occupancy By Id
    @GetMapping("/get/{id}")
    public Optional<BusOccupancy> getBusOccupancyById(@PathVariable Long id) {
        return busOccupancyService.getBusOccupancyById(id);
    }

    // Update Bus Occupancy
    @PutMapping("/update/{id}")
    public BusOccupancy updateBusOccupancy(@PathVariable Long id,
            @RequestBody BusOccupancy busOccupancy) {

        return busOccupancyService.updateBusOccupancy(id, busOccupancy);
    }

    // Delete Bus Occupancy
    @DeleteMapping("/delete/{id}")
    public String deleteBusOccupancy(@PathVariable Long id) {

        busOccupancyService.deleteBusOccupancy(id);
        return "Bus Occupancy Deleted Successfully";
    }

}