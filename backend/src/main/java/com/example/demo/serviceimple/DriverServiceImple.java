package com.example.demo.serviceimple;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Driver;
import com.example.demo.repository.DriverRepository;
import com.example.demo.service.DriverService;

@Service
public class DriverServiceImple implements DriverService {

    @Autowired
    private DriverRepository driverRepository;

    @Override
    public Driver saveDriver(Driver driver) {
        return driverRepository.save(driver);
    }

    @Override
    public Driver login(String username, String password) {
        Optional<Driver> driverOpt = driverRepository.findByUsername(username);
        if (driverOpt.isPresent()) {
            Driver driver = driverOpt.get();
            if (driver.getPassword().equals(password)) {
                return driver;
            }
        }
        throw new RuntimeException("Invalid username or password");
    }

    @Override
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    @Override
    public Optional<Driver> getDriverById(Long id) {
        return driverRepository.findById(id);
    }

    @Override
    public Driver updateDriver(Long id, Driver driver) {

        Driver existingDriver = driverRepository.findById(id).orElse(null);

        if (existingDriver != null) {

            existingDriver.setName(driver.getName());
            existingDriver.setPhone(driver.getPhone());
            existingDriver.setLicense(driver.getLicense());
            existingDriver.setUsername(driver.getUsername());
            existingDriver.setPassword(driver.getPassword());
            existingDriver.setStatus(driver.getStatus());

            return driverRepository.save(existingDriver);
        }

        return null;
    }

    @Override
    public void deleteDriver(Long id) {
        driverRepository.deleteById(id);
    }

}