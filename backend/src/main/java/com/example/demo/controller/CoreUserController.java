package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.models.CoreUser;
import com.example.demo.service.CoreUserService;

@RestController
@RequestMapping("/coreuser")
@CrossOrigin(origins = "*")
public class CoreUserController {

    @Autowired
    private CoreUserService coreUserService;

    // Save Core User
    @PostMapping("/save")
    public CoreUser saveCoreUser(@RequestBody CoreUser coreUser) {
        return coreUserService.saveCoreUser(coreUser);
    }

    // Get All Core Users
    @GetMapping("/getall")
    public List<CoreUser> getAllCoreUsers() {
        return coreUserService.getAllCoreUsers();
    }

    // Get Core User By Id
    @GetMapping("/get/{id}")
    public Optional<CoreUser> getCoreUserById(@PathVariable Long id) {
        return coreUserService.getCoreUserById(id);
    }

    // Update Core User
    @PutMapping("/update/{id}")
    public CoreUser updateCoreUser(@PathVariable Long id,
                                    @RequestBody CoreUser coreUser) {

        return coreUserService.updateCoreUser(id, coreUser);
    }

    // Delete Core User
    @DeleteMapping("/delete/{id}")
    public String deleteCoreUser(@PathVariable Long id) {

        coreUserService.deleteCoreUser(id);
        return "Core User Deleted Successfully";
    }

}