package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.models.CoreUser;

@Repository
public interface CoreUserRepository extends JpaRepository<CoreUser, Long> {

}