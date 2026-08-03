import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin/admin.service';

@Component({
  selector: 'app-manage-students',
  templateUrl: './manage-students.component.html',
  styleUrls: ['./manage-students.component.scss']
})
export class ManageStudentsComponent implements OnInit {
  students: any[] = [];
  filteredStudents: any[] = [];
  buses: any[] = [];
  showModal = false;
  isEditing = false;
  
  currentStudent: any = {
    studentId: null,
    rollNo: '',
    name: '',
    email: '',
    bus: null
  };

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadStudents();
    this.loadBuses();
  }

  loadStudents() {
    this.adminService.getAllStudents().subscribe(data => {
      this.students = data || [];
      this.filteredStudents = [...this.students];
    });
  }

  loadBuses() {
    this.adminService.getAllBuses().subscribe(data => {
      this.buses = data || [];
    });
  }

  onSearch(event: any) {
    const q = event.target.value.toLowerCase();
    this.filteredStudents = this.students.filter(s => 
      s.name?.toLowerCase().includes(q) || 
      s.email?.toLowerCase().includes(q)
    );
  }

  openModal(student?: any) {
    if (student) {
      this.isEditing = true;
      this.currentStudent = { ...student };
      // Make sure we just track the busId for the select dropdown
      if (student.bus) {
        this.currentStudent.busId = student.bus.busId;
      }
    } else {
      this.isEditing = false;
      this.currentStudent = { studentId: null, rollNo: '', name: '', email: '', busId: null };
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveStudent() {
    // Transform busId back to an object for Spring Boot
    if (this.currentStudent.busId) {
      this.currentStudent.bus = { busId: this.currentStudent.busId };
    } else {
      this.currentStudent.bus = null;
    }

    // Set password same as rollNo
    if (this.currentStudent.rollNo) {
      this.currentStudent.password = this.currentStudent.rollNo;
    }

    if (this.isEditing) {
      this.adminService.updateStudent(this.currentStudent.studentId, this.currentStudent).subscribe(() => {
        this.loadStudents();
        this.closeModal();
      });
    } else {
      this.adminService.createStudent(this.currentStudent).subscribe(() => {
        this.loadStudents();
        this.closeModal();
      });
    }
  }

  deleteStudent(id: number) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.adminService.deleteStudent(id).subscribe(() => {
        this.loadStudents();
      });
    }
  }
}
