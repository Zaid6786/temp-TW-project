import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin/admin.service';

@Component({
  selector: 'app-manage-driver',
  templateUrl: './manage-driver.component.html',
  styleUrls: ['./manage-driver.component.scss']
})
export class ManageDriverComponent implements OnInit {
  drivers: any[] = [];
  filteredDrivers: any[] = [];
  showModal = false;
  isEditing = false;
  
  currentDriver: any = {
    driverId: null,
    name: '',
    phone: '',
    status: 'AVAILABLE'
  };

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadDrivers();
  }

  loadDrivers() {
    this.adminService.getAllDrivers().subscribe(data => {
      this.drivers = data || [];
      this.filteredDrivers = [...this.drivers];
    });
  }

  onSearch(event: any) {
    const q = event.target.value.toLowerCase();
    this.filteredDrivers = this.drivers.filter(d => 
      d.name?.toLowerCase().includes(q) || 
      d.driverId?.toString().includes(q)
    );
  }

  openModal(driver?: any) {
    if (driver) {
      this.isEditing = true;
      this.currentDriver = { ...driver };
    } else {
      this.isEditing = false;
      this.currentDriver = { driverId: null, name: '', phone: '', status: 'AVAILABLE' };
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveDriver() {
    if (this.isEditing) {
      this.adminService.updateDriver(this.currentDriver.driverId, this.currentDriver).subscribe(() => {
        this.loadDrivers();
        this.closeModal();
      });
    } else {
      this.adminService.createDriver(this.currentDriver).subscribe(() => {
        this.loadDrivers();
        this.closeModal();
      });
    }
  }

  deleteDriver(id: number) {
    if (confirm('Are you sure you want to delete this driver?')) {
      this.adminService.deleteDriver(id).subscribe(() => {
        this.loadDrivers();
      });
    }
  }
}
