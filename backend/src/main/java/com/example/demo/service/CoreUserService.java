package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.models.CoreUser;

public interface CoreUserService {

    CoreUser saveCoreUser(CoreUser coreUser);

    List<CoreUser> getAllCoreUsers();

    Optional<CoreUser> getCoreUserById(Long id);

    CoreUser updateCoreUser(Long id, CoreUser coreUser);

    void deleteCoreUser(Long id);

}