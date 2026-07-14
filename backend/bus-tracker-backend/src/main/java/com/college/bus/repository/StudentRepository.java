package com.college.bus.repository;

import com.college.bus.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);
    Optional<Student> findByRollNo(String rollNo);
    List<Student> findByRoute_RouteId(Long routeId);
    List<Student> findByBus_BusId(Long busId);
}
