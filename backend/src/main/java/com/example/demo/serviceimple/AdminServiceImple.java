package com.example.demo.serviceimple;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Admin;
import com.example.demo.repository.AdminRepository;
import com.example.demo.service.AdminService;

@Service
public class AdminServiceImple implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public Admin saveAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    @Override
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    @Override
    public Optional<Admin> getAdminById(Long id) {
        return adminRepository.findById(id);
    }

    @Override
    public Admin updateAdmin(Long id, Admin admin) {

        Admin existingAdmin = adminRepository.findById(id).orElse(null);

        if (existingAdmin != null) {

            existingAdmin.setUsername(admin.getUsername());
            existingAdmin.setPassword(admin.getPassword());
            existingAdmin.setEmail(admin.getEmail());
            existingAdmin.setRole(admin.getRole());
            existingAdmin.setFullName(admin.getFullName());
            existingAdmin.setCreatedAt(admin.getCreatedAt());

            return adminRepository.save(existingAdmin);
        }

        return null;
    }

    @Override
    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }

}