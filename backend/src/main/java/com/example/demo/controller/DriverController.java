package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

import com.example.demo.models.Driver;
import com.example.demo.service.DriverService;

@RestController
@RequestMapping("/driver")
@CrossOrigin(origins = "*")
public class DriverController {

    @Autowired
    private DriverService driverService;

    // Save Driver
    @PostMapping("/save")
    public Driver saveDriver(@RequestBody Driver driver) {
        return driverService.saveDriver(driver);
    }

    // Login Driver
    @PostMapping("/login")
    public Map<String, Object> loginDriver(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        Driver driver = driverService.login(username, password);
        Map<String, Object> response = new HashMap<>();
        response.put("token", "mock-jwt-token-for-driver");
        response.put("user", driver);
        return response;
    }

    // Get All Drivers
    @GetMapping("/getall")
    public List<Driver> getAllDrivers() {
        return driverService.getAllDrivers();
    }

    // Get Driver By Id
    @GetMapping("/get/{id}")
    public Optional<Driver> getDriverById(@PathVariable Long id) {
        return driverService.getDriverById(id);
    }

    // Update Driver
    @PutMapping("/update/{id}")
    public Driver updateDriver(@PathVariable Long id,
                               @RequestBody Driver driver) {
        return driverService.updateDriver(id, driver);
    }

    // Delete Driver
    @DeleteMapping("/delete/{id}")
    public String deleteDriver(@PathVariable Long id) {
        driverService.deleteDriver(id);
        return "Driver Deleted Successfully";
    }

}