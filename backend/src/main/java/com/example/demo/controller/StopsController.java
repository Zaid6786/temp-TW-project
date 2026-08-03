package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.models.Stops;
import com.example.demo.service.StopsService;

@RestController
@RequestMapping("/stops")
@CrossOrigin(origins = "*")
public class StopsController {

    @Autowired
    private StopsService stopsService;

    // Save Stop
    @PostMapping("/save")
    public Stops saveStop(@RequestBody Stops stop) {
        return stopsService.saveStop(stop);
    }

    // Get All Stops
    @GetMapping("/getall")
    public List<Stops> getAllStops() {
        return stopsService.getAllStops();
    }

    // Get Stop By Id
    @GetMapping("/get/{id}")
    public Optional<Stops> getStopById(@PathVariable Long id) {
        return stopsService.getStopById(id);
    }

    // Update Stop
    @PutMapping("/update/{id}")
    public Stops updateStop(@PathVariable Long id,
                            @RequestBody Stops stop) {
        return stopsService.updateStop(id, stop);
    }

    // Delete Stop
    @DeleteMapping("/delete/{id}")
    public String deleteStop(@PathVariable Long id) {
        stopsService.deleteStop(id);
        return "Stop Deleted Successfully";
    }

}