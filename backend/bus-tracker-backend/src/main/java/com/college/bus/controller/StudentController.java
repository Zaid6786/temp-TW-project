package com.college.bus.controller;

import com.college.bus.entity.*;
import com.college.bus.model.LoginRequest;
import com.college.bus.model.LoginResponse;
import com.college.bus.service.*;
import com.college.bus.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:4200")
public class StudentController {
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private BusService busService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Student student = studentService.authenticate(
            loginRequest.getEmail(), 
            loginRequest.getPassword()
        );
        
        if (student != null) {
            String token = jwtUtil.generateToken(student.getEmail());
            return ResponseEntity.ok(new LoginResponse(token, student));
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
    
    @GetMapping("/profile/{studentId}")
    public ResponseEntity<Student> getProfile(@PathVariable Long studentId) {
        return studentService.getStudentProfile(studentId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/buses")
    public ResponseEntity<List<Bus>> getAllBuses() {
        return ResponseEntity.ok(studentService.getAllActiveBuses());
    }
    
    @GetMapping("/bus/{busId}")
    public ResponseEntity<Bus> getBusDetails(@PathVariable Long busId) {
        return studentService.getBusById(busId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/bus/{busId}/location")
    public ResponseEntity<BusLocation> getBusLocation(@PathVariable Long busId) {
        BusLocation location = busService.getLatestLocation(busId);
        return location != null ? ResponseEntity.ok(location) : ResponseEntity.notFound().build();
    }
    
    @GetMapping("/bus/{busId}/occupancy")
    public ResponseEntity<BusOccupancy> getBusOccupancy(@PathVariable Long busId) {
        BusOccupancy occupancy = studentService.getBusOccupancy(busId);
        return occupancy != null ? ResponseEntity.ok(occupancy) : ResponseEntity.notFound().build();
    }
    
    @GetMapping("/recommended-bus")
    public ResponseEntity<Bus> getRecommendedBus(@RequestParam Long studentId) {
        Bus recommendedBus = studentService.getRecommendedBus(studentId);
        return recommendedBus != null ? ResponseEntity.ok(recommendedBus) : ResponseEntity.noContent().build();
    }
    
    @GetMapping("/notifications/{studentId}")
    public ResponseEntity<List<Notification>> getNotifications(@PathVariable Long studentId) {
        return ResponseEntity.ok(studentService.getUnreadNotifications(studentId));
    }
    
    @PutMapping("/notification/{notificationId}/read")
    public ResponseEntity<Notification> markNotificationRead(@PathVariable Long notificationId) {
        Notification notification = studentService.markNotificationAsRead(notificationId);
        return notification != null ? ResponseEntity.ok(notification) : ResponseEntity.notFound().build();
    }
    
    @GetMapping("/history/{studentId}")
    public ResponseEntity<List<Attendance>> getHistory(@PathVariable Long studentId) {
        return ResponseEntity.ok(studentService.getStudentHistory(studentId));
    }
}
