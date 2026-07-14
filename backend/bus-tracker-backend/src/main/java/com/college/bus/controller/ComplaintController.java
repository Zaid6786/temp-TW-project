package com.college.bus.controller;

import com.college.bus.entity.Complaint;
import com.college.bus.service.ComplaintService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping
    public ResponseEntity<Complaint> submitComplaint(
            @RequestParam("studentId") Long studentId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            Complaint complaint = complaintService.submitComplaint(studentId, title, description, image);
            return ResponseEntity.ok(complaint);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Complaint>> getStudentComplaints(@PathVariable Long studentId) {
        return ResponseEntity.ok(complaintService.getComplaintsForStudent(studentId));
    }

    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<Complaint> resolveComplaint(
            @PathVariable Long id,
            @RequestParam("adminId") Long adminId) {
        return ResponseEntity.ok(complaintService.resolveComplaint(id, adminId));
    }
}
