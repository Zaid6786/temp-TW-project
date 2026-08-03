import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AdminService } from '../../../services/admin/admin.service';
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
  pollingInterval: any;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadBuses();
    // Start periodic polling for bus coordinates updates every 5 seconds
    this.pollingInterval = setInterval(() => {
      this.loadBuses();
    }, 5000);
  }

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnDestroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
    this.markersMap.forEach(marker => marker.remove());
  }

  loadBuses() {
    this.adminService.getAllBuses().subscribe(data => {
      this.buses = data || [];
      this.updateBusMarkers();
    });
  }

  initMap() {
    mapboxgl.accessToken = environment.mapboxToken;
    const defaultCenter = [78.4867, 17.3850]; // Campus center

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

    this.buses.forEach(bus => {
      const lat = bus.currentLat || 17.3850;
      const lng = bus.currentLng || 78.4867;

      // Check if marker already exists for this bus
      if (this.markersMap.has(bus.busId)) {
        const marker = this.markersMap.get(bus.busId);
        // Smoothly animate marker position updates
        marker.setLngLat([lng, lat]);
      } else {
        // Create custom element
        const el = document.createElement('div');
        el.className = 'custom-bus-marker';
        el.innerHTML = `
          <div class="marker-bubble">
            <span class="bus-icon">🚌</span>
            <span class="bus-id">#${bus.busId}</span>
          </div>
        `;

        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div class="map-popup">
                <h4>Bus #${bus.busId}</h4>
                <p><strong>Route Code:</strong> ${bus.routeCode || 'Unassigned'}</p>
                <p><strong>Capacity:</strong> ${bus.capacity} seats</p>
                <p><strong>Speed:</strong> ${bus.speed || 0} km/h</p>
                <p><strong>Status:</strong> <span class="badge ${bus.status.toLowerCase()}">${bus.status}</span></p>
              </div>
            `)
          )
          .addTo(this.map);

        this.markersMap.set(bus.busId, marker);
      }
    });

    // Clean up markers for deleted buses
    const activeIds = this.buses.map(b => b.busId);
    this.markersMap.forEach((marker, busId) => {
      if (!activeIds.includes(busId)) {
        marker.remove();
        this.markersMap.delete(busId);
      }
    });
  }
}
