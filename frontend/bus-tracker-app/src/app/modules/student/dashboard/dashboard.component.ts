import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {

  studentName = 'Sumasree';
  currentRoute = 'GIET-03';
  status = 'On Route';
  eta = '8 Minutes';
  crowdLevel = 'Medium';
  seatsAvailable = 18;

  constructor() { }

  ngOnInit(): void {
  }
}
