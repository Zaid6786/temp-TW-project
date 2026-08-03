import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentLayoutComponent } from './student-layout/student-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { LiveMapComponent } from './live-map/live-map.component';
import { BusListComponent } from './bus-list/bus-list.component';
import { BusDetailsComponent } from './bus-details/bus-details.component';
import { RecommendedBusComponent } from './recommended-bus/recommended-bus.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProfileComponent } from './profile/profile.component';
import { HistoryComponent } from './history/history.component';
import { ComplaintsComponent } from './complaints/complaints.component';
import { ChatbotComponent } from './chatbot/chatbot.component';

import { authGuard } from '../../guards/auth/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: StudentLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'live-map', component: LiveMapComponent },
      { path: 'buses', component: BusListComponent },
      { path: 'buses/:id', component: BusDetailsComponent },
      { path: 'recommended', component: RecommendedBusComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'complaints', component: ComplaintsComponent },
      { path: 'chatbot', component: ChatbotComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }

