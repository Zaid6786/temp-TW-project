import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'student/login', pathMatch: 'full' },
  { path: 'student', loadChildren: () => import('./modules/student/student.module').then(m => m.StudentModule) },
  { path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule) },
  { path: 'driver', loadChildren: () => import('./modules/driver/driver.module').then(m => m.DriverModule) },
  { path: '**', redirectTo: 'student/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
