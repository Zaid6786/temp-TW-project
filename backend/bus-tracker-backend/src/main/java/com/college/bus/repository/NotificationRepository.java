package com.college.bus.repository;

import com.college.bus.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByStudent_StudentIdAndIsReadFalseOrderByCreatedAtDesc(Long studentId);
    List<Notification> findByStudent_StudentIdOrderByCreatedAtDesc(Long studentId);
}
