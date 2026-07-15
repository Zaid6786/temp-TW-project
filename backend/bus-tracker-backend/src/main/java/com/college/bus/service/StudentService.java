package com.college.bus.service;

import com.college.bus.entity.*;
import com.college.bus.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
@Transactional
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private BusRepository busRepository;
    
    @Autowired
    private BusOccupancyRepository occupancyRepository;
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public Student authenticate(String email, String password) {
        Optional<Student> studentOpt = studentRepository.findByEmail(email);
        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            if (passwordEncoder.matches(password, student.getPassword())) {
                return student;
            }
        }
        return null;
    }
    
    public Student registerStudent(Student student) {
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        return studentRepository.save(student);
    }
    
    public Optional<Student> getStudentProfile(Long studentId) {
        return studentRepository.findById(studentId);
    }
    
    public List<Bus> getAllActiveBuses() {
        return busRepository.findByStatus(BusStatus.ACTIVE);
    }
    
    public Optional<Bus> getBusById(Long busId) {
        return busRepository.findById(busId);
    }
    
    public BusOccupancy getBusOccupancy(Long busId) {
        return occupancyRepository.findByBus_BusId(busId).orElse(null);
    }
    
    public Bus getAssignedBus(Long studentId) {
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isEmpty()) return null;
        
        Student student = studentOpt.get();
        return student.getBus();
    }
    
    public List<Notification> getUnreadNotifications(Long studentId) {
        return notificationRepository.findByStudent_StudentIdAndIsReadFalseOrderByCreatedAtDesc(studentId);
    }
    
    public Notification markNotificationAsRead(Long notificationId) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            notification.setIsRead(true);
            notification.setReadAt(LocalDateTime.now());
            return notificationRepository.save(notification);
        }
        return null;
    }
    
    public List<Attendance> getStudentHistory(Long studentId) {
        // Implementation for fetching student history
        return null; // Implement based on attendance repository
    }
}
