package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.models.Admin;
import com.example.demo.service.AdminService;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private com.example.demo.repository.AdminRepository adminRepository;

    // Login Admin
    @PostMapping("/login")
    public java.util.Map<String, Object> loginAdmin(@RequestBody java.util.Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        
        if (adminOpt.isPresent() && adminOpt.get().getPassword().equals(password)) {
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("token", "rds-token-admin-" + adminOpt.get().getAdminId());
            java.util.Map<String, Object> user = new java.util.HashMap<>();
            user.put("role", "ADMIN");
            user.put("username", adminOpt.get().getUsername());
            user.put("adminId", adminOpt.get().getAdminId());
            response.put("user", user);
            return response;
        }
        throw new RuntimeException("Invalid admin credentials");
    }

    // Save Admin
    @PostMapping("/save")
    public Admin saveAdmin(@RequestBody Admin admin) {
        return adminService.saveAdmin(admin);
    }

    // Get All Admins
    @GetMapping("/getall")
    public List<Admin> getAllAdmins() {
        return adminService.getAllAdmins();
    }

    // Get Admin By Id
    @GetMapping("/get/{id}")
    public Optional<Admin> getAdminById(@PathVariable Long id) {
        return adminService.getAdminById(id);
    }

    // Update Admin
    @PutMapping("/update/{id}")
    public Admin updateAdmin(@PathVariable Long id,
                             @RequestBody Admin admin) {

        return adminService.updateAdmin(id, admin);
    }

    // Delete Admin
    @DeleteMapping("/delete/{id}")
    public String deleteAdmin(@PathVariable Long id) {

        adminService.deleteAdmin(id);
        return "Admin Deleted Successfully";
    }

}