package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.models.Student;
import com.example.demo.service.StudentService;

@RestController
@RequestMapping("/student")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private com.example.demo.repository.StudentRepository studentRepository;

    // Login Student
    @PostMapping("/login")
    public java.util.Map<String, Object> loginStudent(@RequestBody java.util.Map<String, String> credentials) {
        String identifier = credentials.get("email");
        String password = credentials.get("password");
        
        Optional<Student> studentOpt = studentRepository.findByEmail(identifier);
        if (!studentOpt.isPresent()) {
            studentOpt = studentRepository.findByRollNo(identifier);
        }
        
        if (studentOpt.isPresent() && studentOpt.get().getPassword().equals(password)) {
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("token", "rds-token-student-" + studentOpt.get().getStudentId());
            java.util.Map<String, Object> user = new java.util.HashMap<>();
            user.put("role", "STUDENT");
            user.put("studentId", studentOpt.get().getStudentId());
            user.put("username", studentOpt.get().getName());
            user.put("email", studentOpt.get().getEmail());
            response.put("user", user);
            return response;
        }
        throw new RuntimeException("Invalid student credentials");
    }

    // Save Student
    @PostMapping("/save")
    public Student saveStudent(@RequestBody Student student) {
        return studentService.saveStudent(student);
    }

    // Get All Students
    @GetMapping("/getall")
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    // Get Student By Id
    @GetMapping("/get/{id}")
    public Optional<Student> getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id);
    }

    // Update Student
    @PutMapping("/update/{id}")
    public Student updateStudent(@PathVariable Long id,
                                 @RequestBody Student student) {
        return studentService.updateStudent(id, student);
    }

    // Delete Student
    @DeleteMapping("/delete/{id}")
    public String deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return "Student Deleted Successfully";
    }

}