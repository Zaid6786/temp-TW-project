import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth/auth.service';
import { StudentService } from '../../../services/student/student.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-driver-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  driverName = 'Driver';
  isTracking = false;
  trackingStatus = 'Off';
  watchId: number | null = null;
  lastPosition: { lat: number; lng: number } | null = null;
  
  buses: any[] = [];
  selectedBusId: number | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private studentService: StudentService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.driverName = user.name || user.username || 'Driver';
      } else if (!this.authService.isLoggedIn()) {
        this.router.navigate(['/driver/login']);
      }
    });

    // Load available buses to assign driver location to
    this.studentService.getAllBuses().subscribe(data => {
      this.buses = data || [];
      if (this.buses.length > 0) {
        this.selectedBusId = this.buses[0].busId;
      }
    });
  }

  ngOnDestroy() {
    this.stopTracking();
  }

  logout() {
    this.stopTracking();
    this.authService.logout();
    this.router.navigate(['/driver/login']);
  }

  toggleTracking() {
    if (this.isTracking) {
      this.stopTracking();
    } else {
      this.startTracking();
    }
  }

  startTracking() {
    if (!this.selectedBusId) {
      alert('Please select your assigned bus from the dropdown.');
      return;
    }

    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    this.isTracking = true;
    this.trackingStatus = 'Initializing GPS...';

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.lastPosition = { lat, lng };
        this.trackingStatus = 'Broadcasting live coordinates...';

        // Post location to Spring Boot endpoint (using same endpoint as student live-map previously mocked)
        const locationPayload = {
          latitude: lat,
          longitude: lng,
          speed: position.coords.speed || 0.0,
          heading: position.coords.heading || 0.0,
          accuracy: position.coords.accuracy || 0.0
        };

        this.http.post(`${environment.apiUrl}/student/bus/${this.selectedBusId}/location`, locationPayload, { headers })
          .subscribe({
            next: (res: any) => console.log('Location synced successfully'),
            error: (err) => console.error('Failed to sync location', err)
          });
      },
      (error) => {
        console.error('Geolocation error:', error);
        this.trackingStatus = `Error: ${error.message}`;
        this.isTracking = false;
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  stopTracking() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isTracking = false;
    this.trackingStatus = 'Off';
    this.lastPosition = null;
  }
}
