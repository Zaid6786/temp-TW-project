package com.example.demo.serviceimple;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.CoreUser;
import com.example.demo.repository.CoreUserRepository;
import com.example.demo.service.CoreUserService;

@Service
public class CoreUserServiceImple implements CoreUserService {

    @Autowired
    private CoreUserRepository coreUserRepository;

    @Override
    public CoreUser saveCoreUser(CoreUser coreUser) {
        return coreUserRepository.save(coreUser);
    }

    @Override
    public List<CoreUser> getAllCoreUsers() {
        return coreUserRepository.findAll();
    }

    @Override
    public Optional<CoreUser> getCoreUserById(Long id) {
        return coreUserRepository.findById(id);
    }

    @Override
    public CoreUser updateCoreUser(Long id, CoreUser coreUser) {

        CoreUser existingCoreUser =
                coreUserRepository.findById(id).orElse(null);

        if (existingCoreUser != null) {

            existingCoreUser.setUsername(coreUser.getUsername());
            existingCoreUser.setEmail(coreUser.getEmail());
            existingCoreUser.setPassword(coreUser.getPassword());
            existingCoreUser.setRole(coreUser.getRole());
            existingCoreUser.setPhoneNumber(coreUser.getPhoneNumber());
            existingCoreUser.setIsActive(coreUser.getIsActive());
            existingCoreUser.setCreatedAt(coreUser.getCreatedAt());

            return coreUserRepository.save(existingCoreUser);
        }

        return null;
    }

    @Override
    public void deleteCoreUser(Long id) {
        coreUserRepository.deleteById(id);
    }

}