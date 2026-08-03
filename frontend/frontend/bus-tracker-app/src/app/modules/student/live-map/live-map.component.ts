import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { StudentService } from '../../../services/student/student.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

declare var mapboxgl: any;

@Component({
  selector: 'app-live-map',
  templateUrl: './live-map.component.html',
  styleUrls: ['./live-map.component.scss']
})
export class LiveMapComponent implements OnInit, OnDestroy, AfterViewInit {
  map: any;
  buses: any[] = [];
  markersMap: Map<number, any> = new Map();
  selectedBusId: number | null = null;
  
  // Tracking states
  isTracking: boolean = false;
  watchId: number | null = null;
  lastPosition: { lat: number; lng: number } | null = null;
  trackingStatus: string = 'Off';
  
  constructor(
    private studentService: StudentService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadBuses();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnDestroy() {
    this.stopTracking();
  }

  loadBuses() {
    this.studentService.getAllBuses().subscribe(data => {
      this.buses = data || [];
      if (this.buses.length > 0) {
        this.selectedBusId = this.buses[0].busId;
      }
      this.updateBusMarkers();
    });
  }

  initMap() {
    mapboxgl.accessToken = environment.mapboxToken;
    
    // Default coordinates: city center or campus (Hyderabad, India center: 78.4867, 17.3850)
    const defaultCenter = [78.4867, 17.3850];
    
    this.map = new mapboxgl.Map({
      container: 'mapbox-container',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: defaultCenter,
      zoom: 12
    });

    this.map.addControl(new mapboxgl.NavigationControl());
  }

  updateBusMarkers() {
    if (!this.map) return;

    // Clear existing markers
    this.markersMap.forEach(marker => marker.remove());
    this.markersMap.clear();

    this.buses.forEach(bus => {
      // Find latitude & longitude
      // Use current bus coordinates if available, otherwise check latest location API
      const lat = bus.currentLat || 17.3850;
      const lng = bus.currentLng || 78.4867;

      // Create a custom DOM element for the bus marker
      const el = document.createElement('div');
      el.className = 'custom-bus-marker';
      el.innerHTML = `
        <div class="marker-bubble">
          <span class="bus-icon">🚌</span>
          <span class="bus-id">#${bus.busId}</span>
        </div>
      `;

      // Create mapbox marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="map-popup">
              <h4>Bus #${bus.busId}</h4>
              <p><strong>Route:</strong> ${bus.routeCode || 'N/A'}</p>
              <p><strong>Status:</strong> ${bus.status}</p>
              <p><strong>Last stop:</strong> ${bus.currentStop || 'In Transit'}</p>
            </div>
          `)
        )
        .addTo(this.map);

      this.markersMap.set(bus.busId, marker);
    });

    // Auto-fit to bounds if multiple markers exist
    if (this.buses.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      this.buses.forEach(bus => {
        bounds.extend([bus.currentLng || 78.4867, bus.currentLat || 17.3850]);
      });
      this.map.fitBounds(bounds, { padding: 50, maxZoom: 14 });
    }
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
      alert('Please select a bus to simulate driving.');
      return;
    }

    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    this.isTracking = true;
    this.trackingStatus = 'Initializing...';

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
        this.trackingStatus = 'Sharing live coordinates...';

        // Update map center to local position
        this.map.flyTo({
          center: [lng, lat],
          zoom: 15,
          essential: true
        });

        // Update local bus marker immediately
        const marker = this.markersMap.get(this.selectedBusId!);
        if (marker) {
          marker.setLngLat([lng, lat]);
        }

        // Post location to Spring Boot endpoint
        const locationPayload = {
          latitude: lat,
          longitude: lng,
          speed: position.coords.speed || 0.0,
          heading: position.coords.heading || 0.0,
          accuracy: position.coords.accuracy || 0.0
        };

        this.http.post(`${environment.apiUrl}/student/bus/${this.selectedBusId}/location`, locationPayload, { headers })
          .subscribe({
            next: (res: any) => {
              console.log('Driver coordinates synced successfully:', res);
            },
            error: (err) => {
              console.error('Failed to sync driver coordinates with server:', err);
            }
          });
      },
      (error) => {
        console.error('Geolocation sharing error:', error);
        this.trackingStatus = `Error: ${error.message}`;
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
  }
}
