package com.college.bus.service;

import com.college.bus.entity.Complaint;
import com.college.bus.model.ComplaintStatus;
import com.college.bus.repository.ComplaintRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final AwsS3Service awsS3Service;

    public ComplaintService(ComplaintRepository complaintRepository, AwsS3Service awsS3Service) {
        this.complaintRepository = complaintRepository;
        this.awsS3Service = awsS3Service;
    }

    public Complaint submitComplaint(Long studentId, String title, String description, MultipartFile image) throws IOException {
        Complaint complaint = new Complaint();
        complaint.setStudentId(studentId);
        complaint.setTitle(title);
        complaint.setDescription(description);

        if (image != null && !image.isEmpty()) {
            String imageUrl = awsS3Service.uploadFile(image);
            complaint.setImageUrl(imageUrl);
        }

        return complaintRepository.save(complaint);
    }

    public List<Complaint> getComplaintsForStudent(Long studentId) {
        return complaintRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc();
    }

    public Complaint resolveComplaint(Long complaintId, Long adminId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id " + complaintId));
        
        complaint.setStatus(ComplaintStatus.RESOLVED);
        complaint.setResolvedAt(LocalDateTime.now());
        complaint.setResolvedBy(adminId);
        
        return complaintRepository.save(complaint);
    }
}
