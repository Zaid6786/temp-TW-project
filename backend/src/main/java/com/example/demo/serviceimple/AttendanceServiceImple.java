package com.example.demo.serviceimple;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Attendance;
import com.example.demo.repository.AttendanceRepository;
import com.example.demo.service.AttendanceService;

@Service
public class AttendanceServiceImple implements AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Override
    public Attendance saveAttendance(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    @Override
    public List<Attendance> getAllAttendances() {
        return attendanceRepository.findAll();
    }

    @Override
    public Optional<Attendance> getAttendanceById(Long id) {
        return attendanceRepository.findById(id);
    }

    @Override
    public Attendance updateAttendance(Long id, Attendance attendance) {

        Attendance existingAttendance =
                attendanceRepository.findById(id).orElse(null);

        if (existingAttendance != null) {

            existingAttendance.setStudentId(attendance.getStudentId());
            existingAttendance.setBusId(attendance.getBusId());
            existingAttendance.setScanTime(attendance.getScanTime());
            existingAttendance.setScanType(attendance.getScanType());
            existingAttendance.setCreatedAt(attendance.getCreatedAt());

            return attendanceRepository.save(existingAttendance);
        }

        return null;
    }

    @Override
    public void deleteAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }

}