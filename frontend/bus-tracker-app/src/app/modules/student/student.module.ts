import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StudentRoutingModule } from './student-routing.module';
import { LiveMapComponent } from './live-map/live-map.component';
import { BusListComponent } from './bus-list/bus-list.component';
import { BusDetailsComponent } from './bus-details/bus-details.component';
import { RecommendedBusComponent } from './recommended-bus/recommended-bus.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProfileComponent } from './profile/profile.component';
import { HistoryComponent } from './history/history.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ComplaintsComponent } from './complaints/complaints.component';
import { StudentLayoutComponent } from './student-layout/student-layout.component';
import { ChatbotComponent } from './chatbot/chatbot.component';

@NgModule({
  declarations: [
    LiveMapComponent,
    BusListComponent,
    BusDetailsComponent,
    RecommendedBusComponent,
    NotificationsComponent,
    ProfileComponent,
    HistoryComponent,
    DashboardComponent,
    LoginComponent,
    ComplaintsComponent,
    StudentLayoutComponent,
    ChatbotComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class StudentModule { }
