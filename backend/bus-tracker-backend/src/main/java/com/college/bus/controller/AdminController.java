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
    
    @Autowired
    private com.college.bus.repository.AdminRepository adminRepository;
    
    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody LoginRequest loginRequest) {
        java.util.Optional<Admin> adminOpt = adminRepository.findByEmail(loginRequest.getEmail());
        
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            // In a real app, use BCrypt. For now, simple string comparison.
            if (admin.getPassword().equals(loginRequest.getPassword()) || 
                // Allow the plaintext match if testing locally before hashing
                "$2a$10$YourHashedPassword".equals(admin.getPassword()) && "password".equals(loginRequest.getPassword())) {
                
                String token = jwtUtil.generateToken(admin.getEmail());
                return ResponseEntity.ok(new LoginResponse(token, admin));
            }
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

    // --- Route Endpoints ---
    @Autowired
    private com.college.bus.repository.RouteRepository routeRepository;

    @GetMapping("/route")
    public ResponseEntity<List<Route>> getAllRoutes() {
        return ResponseEntity.ok(routeRepository.findAll());
    }

    @PostMapping("/route")
    public ResponseEntity<Route> createRoute(@RequestBody Route route) {
        return ResponseEntity.ok(routeRepository.save(route));
    }

    @PutMapping("/route/{routeId}")
    public ResponseEntity<Route> updateRoute(@PathVariable Long routeId, @RequestBody Route route) {
        if (!routeRepository.existsById(routeId)) return ResponseEntity.notFound().build();
        route.setRouteId(routeId);
        return ResponseEntity.ok(routeRepository.save(route));
    }

    @DeleteMapping("/route/{routeId}")
    public ResponseEntity<Void> deleteRoute(@PathVariable Long routeId) {
        routeRepository.deleteById(routeId);
        return ResponseEntity.ok().build();
    }

    // --- Driver Endpoints ---
    @Autowired
    private com.college.bus.repository.DriverRepository driverRepository;

    @GetMapping("/driver")
    public ResponseEntity<List<Driver>> getAllDrivers() {
        return ResponseEntity.ok(driverRepository.findAll());
    }

    @PostMapping("/driver")
    public ResponseEntity<Driver> createDriver(@RequestBody Driver driver) {
        return ResponseEntity.ok(driverRepository.save(driver));
    }

    @PutMapping("/driver/{driverId}")
    public ResponseEntity<Driver> updateDriver(@PathVariable Long driverId, @RequestBody Driver driver) {
        if (!driverRepository.existsById(driverId)) return ResponseEntity.notFound().build();
        driver.setDriverId(driverId);
        return ResponseEntity.ok(driverRepository.save(driver));
    }

    @DeleteMapping("/driver/{driverId}")
    public ResponseEntity<Void> deleteDriver(@PathVariable Long driverId) {
        driverRepository.deleteById(driverId);
        return ResponseEntity.ok().build();
    }

    // --- Stop Endpoints ---
    @Autowired
    private com.college.bus.repository.StopRepository stopRepository;

    @GetMapping("/stop")
    public ResponseEntity<List<Stop>> getAllStops() {
        return ResponseEntity.ok(stopRepository.findAll());
    }

    @PostMapping("/stop")
    public ResponseEntity<Stop> createStop(@RequestBody Stop stop) {
        return ResponseEntity.ok(stopRepository.save(stop));
    }

    @PutMapping("/stop/{stopId}")
    public ResponseEntity<Stop> updateStop(@PathVariable Long stopId, @RequestBody Stop stop) {
        if (!stopRepository.existsById(stopId)) return ResponseEntity.notFound().build();
        stop.setStopId(stopId);
        return ResponseEntity.ok(stopRepository.save(stop));
    }

    @DeleteMapping("/stop/{stopId}")
    public ResponseEntity<Void> deleteStop(@PathVariable Long stopId) {
        stopRepository.deleteById(stopId);
        return ResponseEntity.ok().build();
    }

    // --- Student Endpoints ---
    @Autowired
    private com.college.bus.repository.StudentRepository studentRepository;

    @GetMapping("/student")
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentRepository.findAll());
    }

    @PostMapping("/student")
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {
        return ResponseEntity.ok(studentRepository.save(student));
    }

    @PutMapping("/student/{studentId}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long studentId, @RequestBody Student student) {
        if (!studentRepository.existsById(studentId)) return ResponseEntity.notFound().build();
        student.setStudentId(studentId);
        return ResponseEntity.ok(studentRepository.save(student));
    }

    @DeleteMapping("/student/{studentId}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long studentId) {
        studentRepository.deleteById(studentId);
        return ResponseEntity.ok().build();
    }
}
