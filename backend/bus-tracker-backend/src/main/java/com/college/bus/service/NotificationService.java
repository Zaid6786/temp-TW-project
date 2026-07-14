package com.college.bus.service;

import com.college.bus.entity.*;
import com.college.bus.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;
    
    public Notification createNotification(Notification notification) {
        notification.setCreatedAt(LocalDateTime.now());
        notification.setIsRead(false);
        return notificationRepository.save(notification);
    }
    
    public void sendBusArrivalNotification(Long studentId, Bus bus, int minutes) {
        Notification notification = new Notification();
        Student student = new Student();
        student.setStudentId(studentId);
        notification.setStudent(student);
        notification.setBus(bus);
        notification.setTitle("Bus Arriving Soon");
        notification.setMessage("Bus " + bus.getBusNo() + " arriving in " + minutes + " minutes");
        notification.setType(NotificationType.ARRIVAL);
        createNotification(notification);
    }
    
    public void sendBusDelayNotification(Long studentId, Bus bus, String reason, int minutes) {
        Notification notification = new Notification();
        Student student = new Student();
        student.setStudentId(studentId);
        notification.setStudent(student);
        notification.setBus(bus);
        notification.setTitle("Bus Delayed");
        notification.setMessage("Bus " + bus.getBusNo() + " delayed by " + minutes + 
                              " minutes due to " + reason);
        notification.setType(NotificationType.DELAY);
        createNotification(notification);
    }
    
    public void sendBusFullNotification(Long studentId, Bus bus) {
        Notification notification = new Notification();
        Student student = new Student();
        student.setStudentId(studentId);
        notification.setStudent(student);
        notification.setBus(bus);
        notification.setTitle("Bus Almost Full");
        notification.setMessage("Bus " + bus.getBusNo() + " is almost full. Consider alternative bus.");
        notification.setType(NotificationType.FULL);
        createNotification(notification);
    }
}
