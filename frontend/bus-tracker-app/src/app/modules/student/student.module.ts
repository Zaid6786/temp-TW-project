import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StudentRoutingModule } from './student-routing.module';
import { StudentDashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { LiveMapComponent } from './live-map/live-map.component';
import { BusListComponent } from './bus-list/bus-list.component';
import { BusDetailsComponent } from './bus-details/bus-details.component';
import { RecommendedBusComponent } from './recommended-bus/recommended-bus.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProfileComponent } from './profile/profile.component';
import { HistoryComponent } from './history/history.component';
import { StudentComplaintsComponent } from './complaints/complaints.component';

@NgModule({
  declarations: [
    StudentDashboardComponent,
    LoginComponent,
    LiveMapComponent,
    BusListComponent,
    BusDetailsComponent,
    RecommendedBusComponent,
    NotificationsComponent,
    ProfileComponent,
    HistoryComponent,
    StudentComplaintsComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class StudentModule { }
