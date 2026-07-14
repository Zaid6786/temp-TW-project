package com.college.bus.controller;

import com.college.bus.entity.*;
import com.college.bus.service.*;
import com.college.bus.model.LoginRequest;
import com.college.bus.model.LoginResponse;
import com.college.bus.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {
    @Autowired
    private BusService busService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody LoginRequest loginRequest) {
        // Dummy implementation for admin login
        if ("admin@college.edu".equals(loginRequest.getEmail()) && "password".equals(loginRequest.getPassword())) {
            String token = jwtUtil.generateToken(loginRequest.getEmail());
            return ResponseEntity.ok(new LoginResponse(token, "admin"));
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<BusService.DashboardStats> getDashboardStats() {
        return ResponseEntity.ok(busService.getDashboardStats());
    }
    
    @PostMapping("/bus")
    public ResponseEntity<Bus> createBus(@RequestBody Bus bus) {
        return ResponseEntity.ok(busService.createBus(bus));
    }
    
    @PutMapping("/bus/{busId}")
    public ResponseEntity<Bus> updateBus(@PathVariable Long busId, @RequestBody Bus bus) {
        Bus updatedBus = busService.updateBus(busId, bus);
        return updatedBus != null ? ResponseEntity.ok(updatedBus) : ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/bus/{busId}")
    public ResponseEntity<Void> deleteBus(@PathVariable Long busId) {
        busService.deleteBus(busId);
        return ResponseEntity.ok().build();
    }
}
