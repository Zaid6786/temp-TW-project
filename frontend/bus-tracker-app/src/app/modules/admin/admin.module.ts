import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
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
import { AdminComplaintsComponent } from './complaints/complaints.component';

@NgModule({
  declarations: [
    DashboardComponent,
    LoginComponent,
    LiveMapComponent,
    ManageBusComponent,
    ManageDriverComponent,
    ManageRouteComponent,
    ManageStopsComponent,
    ManageStudentsComponent,
    ReportsComponent,
    SettingsComponent,
    AdminComplaintsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
