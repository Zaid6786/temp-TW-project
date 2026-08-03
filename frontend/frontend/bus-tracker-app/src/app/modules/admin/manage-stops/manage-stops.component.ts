import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin/admin.service';

@Component({
  selector: 'app-manage-stops',
  templateUrl: './manage-stops.component.html',
  styleUrls: ['./manage-stops.component.scss']
})
export class ManageStopsComponent implements OnInit {
  stops: any[] = [];
  filteredStops: any[] = [];
  showModal = false;
  isEditing = false;
  
  currentStop: any = {
    stopId: null,
    name: '',
    latitude: 0,
    longitude: 0,
    routeCode: ''
  };

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadStops();
  }

  loadStops() {
    this.adminService.getAllStops().subscribe(data => {
      this.stops = data || [];
      this.filteredStops = [...this.stops];
    });
  }

  onSearch(event: any) {
    const q = event.target.value.toLowerCase();
    this.filteredStops = this.stops.filter(s => 
      s.name?.toLowerCase().includes(q)
    );
  }

  openModal(stop?: any) {
    if (stop) {
      this.isEditing = true;
      this.currentStop = { ...stop };
    } else {
      this.isEditing = false;
      this.currentStop = { stopId: null, name: '', latitude: 0, longitude: 0, routeCode: '' };
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveStop() {
    if (this.isEditing) {
      this.adminService.updateStop(this.currentStop.stopId, this.currentStop).subscribe(() => {
        this.loadStops();
        this.closeModal();
      });
    } else {
      this.adminService.createStop(this.currentStop).subscribe(() => {
        this.loadStops();
        this.closeModal();
      });
    }
  }

  deleteStop(id: number) {
    if (confirm('Are you sure you want to delete this stop?')) {
      this.adminService.deleteStop(id).subscribe(() => {
        this.loadStops();
      });
    }
  }
}
