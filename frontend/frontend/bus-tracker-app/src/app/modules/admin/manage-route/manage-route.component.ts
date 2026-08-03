import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin/admin.service';

@Component({
  selector: 'app-manage-route',
  templateUrl: './manage-route.component.html',
  styleUrls: ['./manage-route.component.scss']
})
export class ManageRouteComponent implements OnInit {
  routes: any[] = [];
  showModal = false;
  isEditing = false;
  
  currentRoute: any = {
    routeId: null,
    routeCode: '',
    startPoint: '',
    endPoint: '',
    distance: 0,
    estimatedTime: 0
  };

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadRoutes();
  }

  loadRoutes() {
    this.adminService.getAllRoutes().subscribe(data => {
      this.routes = data || [];
    });
  }

  openModal(route?: any) {
    if (route) {
      this.isEditing = true;
      this.currentRoute = { ...route };
    } else {
      this.isEditing = false;
      this.currentRoute = { routeId: null, routeCode: '', startPoint: '', endPoint: '', distance: 0, estimatedTime: 0 };
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveRoute() {
    if (this.isEditing) {
      this.adminService.updateRoute(this.currentRoute.routeId, this.currentRoute).subscribe(() => {
        this.loadRoutes();
        this.closeModal();
      });
    } else {
      this.adminService.createRoute(this.currentRoute).subscribe(() => {
        this.loadRoutes();
        this.closeModal();
      });
    }
  }

  deleteRoute(id: number) {
    if (confirm('Are you sure you want to delete this route?')) {
      this.adminService.deleteRoute(id).subscribe(() => {
        this.loadRoutes();
      });
    }
  }
}
