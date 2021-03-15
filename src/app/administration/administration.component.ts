import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ParkingSlotsService } from '../parking-slots.service'

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {

  private map: any;
  private parkSlots: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private parkingSlotsService: ParkingSlotsService) { }

  private initMap(): void {
    const allLayers = L.layerGroup();

    const googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], attribution: '&copy; <a href="https//www.google.com/permissions">Google Maps</a>' }),
      googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], attribution: '&copy; <a href="https//www.google.com/permissions">Google Maps</a>' }),
      googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], attribution: '&copy; <a href="https//www.google.com/permissions">Google Maps</a>' }),
      googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], attribution: '&copy; <a href="https//www.google.com/permissions">Google Maps</a>' }),
      OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}{x}{y}.png', { attribution: '&copy; <a href="https//www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' });

    this.map = L.map('map', {
      center: [-17.39040873783931, 32.24083900451661],
      zoom: 13,
      minZoom: 9,
      maxZoom: 19,
      boxZoom: true,
      layers: [googleHybrid, allLayers],
    })

    // Creating scale control
    var scale = L.control.scale();
    scale.addTo(this.map);
  }

  ngOnInit(): void {
    // Initialize the map container
    this.initMap();
    // Get Parking Slots Data
    this.parkingSlotsService.getParkingSlots().pipe(takeUntil(this.destroy$)).subscribe(slots => {
      this.parkSlots = slots;
      this.initParkingSlotsLayer();
    });
  }

  //Parking Slots Styling
  private initParkingSlotsLayer() {
    const slotsLayer = L.geoJSON(this.parkSlots, {
      style: (feature) => ({
        weight: 3,
        opacity: 0.5,
        color: '#008f68',
        fillOpacity: 0.8,
        fillColor: '#6db65b'
      }),
      onEachFeature: (feature, layer) => (
        layer.on({
          click: (e) => (this.layerClick(e)),
          mouseover: (e) => (this.highlightFeature(e)),
          mouseout: (e) => (this.resetFeature(e))
        })
      )
    });
    this.map.addLayer(slotsLayer);
  }

  // Highlight feature event
  private highlightFeature(e: any) {
    const layer = e.target;
    layer.setStyle({
      weight: 10,
      opacity: 1.0,
      color: '#dfa612',
      fillOpacity: 1.0,
      fillColor: '#fae042'
    });
  }
  // reset hightlight event
  private resetFeature(e: any) {
    const layer = e.target;
    layer.setStyle({
      weight: 3,
      opacity: 0.5,
      color: '#008f68',
      fillOpacity: 0.8,
      fillColor: '#6db65b'
    })
  }

  // bind popup on layer click
  private layerClick(e: any) {
    let layer = e.target;
    if (layer.feature.properties.stand_id == 2900) {
      layer.bindPopup('<h3>This slot is' + '\t' + layer.feature.properties.stand_id + '</h3><br/><button class="btn btn-outline-primary">Book Into It</button>');
    }
    else {
      layer.bindPopup('<h3>This slot is ' + '\t' + layer.feature.properties.stand_id + '</h3>');
    }
  }

  // Button reserve all slots click event
  onReserveAllSlots() {
    window.alert('Reseve Slots Clicked')
  }

  // Button make all slots VIP event
  onAllSlotsVIP() {
    window.alert('VIP all slots clicked')
  }

  // Button all slots vacant event
  onAllSlotsVacant() {
    window.alert('Vacant Slots Clicked')
  }

  // Button on logout event
  onLogout() {
    window.location.href = "/home";
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
