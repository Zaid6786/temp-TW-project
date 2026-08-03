import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { LiveMapComponent } from './live-map/live-map.component';
import { ManageBusComponent } from './manage-bus/manage-bus.component';
import { ManageDriverComponent } from './manage-driver/manage-driver.component';
import { ManageRouteComponent } from './manage-route/manage-route.component';
import { ManageStopsComponent } from './manage-stops/manage-stops.component';
import { ManageStudentsComponent } from './manage-students/manage-students.component';
import { ReportsComponent } from './reports/reports.component';
import { SettingsComponent } from './settings/settings.component';
import { ComplaintsComponent } from './complaints/complaints.component';

import { authGuard } from '../../guards/auth/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: '', 
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'live-map', component: LiveMapComponent },
      { path: 'buses', component: ManageBusComponent },
      { path: 'drivers', component: ManageDriverComponent },
      { path: 'routes', component: ManageRouteComponent },
      { path: 'stops', component: ManageStopsComponent },
      { path: 'students', component: ManageStudentsComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'complaints', component: ComplaintsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

