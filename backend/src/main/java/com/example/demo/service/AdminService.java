package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.models.Admin;

public interface AdminService {

    Admin saveAdmin(Admin admin);

    List<Admin> getAllAdmins();

    Optional<Admin> getAdminById(Long id);

    Admin updateAdmin(Long id, Admin admin);

    void deleteAdmin(Long id);

}