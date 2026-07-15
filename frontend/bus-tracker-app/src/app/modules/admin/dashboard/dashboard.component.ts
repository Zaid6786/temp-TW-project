import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin/admin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: any = {
    totalBuses: 0,
    activeRoutes: 0,
    activeDrivers: 0,
    unresolvedComplaints: 0
  };

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getDashboardStats().subscribe(data => {
      if (data) {
        this.stats = data;
      } else {
        // Fallback mock
        this.stats = {
          totalBuses: 12,
          activeRoutes: 5,
          activeDrivers: 15,
          unresolvedComplaints: 3
        };
      }
    });
  }
}
