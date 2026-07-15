import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin/admin.service';

@Component({
  selector: 'app-manage-bus',
  templateUrl: './manage-bus.component.html',
  styleUrls: ['./manage-bus.component.scss']
})
export class ManageBusComponent implements OnInit {
  buses: any[] = [];
  filteredBuses: any[] = [];
  searchQuery = '';
  showModal = false;
  isEditing = false;
  
  currentBus: any = {
    busId: null,
    registrationNumber: '',
    capacity: 0,
    status: 'ACTIVE',
    routeCode: ''
  };

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadBuses();
  }

  loadBuses() {
    this.adminService.getAllBuses().subscribe(data => {
      this.buses = data || [];
      this.filteredBuses = [...this.buses];
    });
  }

  onSearch(event: any) {
    const q = event.target.value.toLowerCase();
    this.filteredBuses = this.buses.filter(b => 
      b.registrationNumber?.toLowerCase().includes(q) || 
      b.busId?.toString().includes(q)
    );
  }

  openModal(bus?: any) {
    if (bus) {
      this.isEditing = true;
      this.currentBus = { ...bus };
    } else {
      this.isEditing = false;
      this.currentBus = { busId: null, registrationNumber: '', capacity: 0, status: 'ACTIVE', routeCode: '' };
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveBus() {
    if (this.isEditing) {
      this.adminService.updateBus(this.currentBus.busId, this.currentBus).subscribe(() => {
        this.loadBuses();
        this.closeModal();
      });
    } else {
      this.adminService.createBus(this.currentBus).subscribe(() => {
        this.loadBuses();
        this.closeModal();
      });
    }
  }

  deleteBus(id: number) {
    if (confirm('Are you sure you want to delete this bus?')) {
      this.adminService.deleteBus(id).subscribe(() => {
        this.loadBuses();
      });
    }
  }
}
