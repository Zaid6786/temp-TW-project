package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.example.demo.repository.AdminRepository;
import com.example.demo.models.Admin;
import java.time.LocalDateTime;

@SpringBootApplication
public class TeamprojectCollegebusApplication {

	public static void main(String[] args) {
		SpringApplication.run(TeamprojectCollegebusApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(AdminRepository adminRepository) {
		return args -> {
			if (adminRepository.findByUsername("admin").isEmpty()) {
				Admin defaultAdmin = new Admin();
				defaultAdmin.setUsername("admin");
				defaultAdmin.setPassword("admin123");
				defaultAdmin.setEmail("admin@collegebus.com");
				defaultAdmin.setRole(Admin.AdminRole.SUPER_ADMIN);
				defaultAdmin.setFullName("System Administrator");
				defaultAdmin.setCreatedAt(LocalDateTime.now());
				adminRepository.save(defaultAdmin);
				System.out.println("Default Admin initialized!");
			}
		};
	}
}
