import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../services/student/student.service';

@Component({
  selector: 'app-bus-list',
  templateUrl: './bus-list.component.html',
  styleUrls: ['./bus-list.component.scss']
})
export class BusListComponent implements OnInit {
  buses: any[] = [];
  filteredBuses: any[] = [];
  searchQuery = '';

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.studentService.getAllBuses().subscribe(data => {
      if (data && data.length > 0) {
        this.buses = data;
        this.filteredBuses = data;
      } else {
        // Fallback mock
        this.buses = [
          { busId: 4, routeCode: 'Route A', capacity: 50, status: 'ACTIVE', currentStop: 'Library' },
          { busId: 7, routeCode: 'Route C', capacity: 40, status: 'ACTIVE', currentStop: 'South Gate' }
        ];
        this.filteredBuses = this.buses;
      }
    });
  }

  onSearch(event: any) {
    const q = event.target.value.toLowerCase();
    this.filteredBuses = this.buses.filter(b => 
      b.routeCode?.toLowerCase().includes(q) || 
      b.busId?.toString().includes(q)
    );
  }
}
