import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { DataService } from '../data.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ParkingSlotsService } from '../parking-slots.service'

@Component({
  selector: 'app-findparkingspace',
  templateUrl: './findparkingspace.component.html',
  styleUrls: ['./findparkingspace.component.css']
})

export class FindparkingspaceComponent implements OnInit, OnDestroy {
  private map: any;
  private parkSlots: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private dataService: DataService, private parkingSlotsService: ParkingSlotsService) { }

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
    //Get Other Data
    this.dataService.sendGetRequest().pipe(takeUntil(this.destroy$)).subscribe((data: any) => {

      /*const allLayers = L.layerGroup();

      const googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], attribution: '&copy; <a href="https//www.google.com/permissions">Google Maps</a>' }),
        googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], attribution: '&copy; <a href="https//www.google.com/permissions">Google Maps</a>' }),
        googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], attribution: '&copy; <a href="https//www.google.com/permissions">Google Maps</a>' }),
        googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], attribution: '&copy; <a href="https//www.google.com/permissions">Google Maps</a>' }),
        OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}{x}{y}.png', { attribution: '&copy; <a href="https//www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' });


      const map = L.map('map', {
        center: [-17.39040873783931, 32.24083900451661],
        zoom: 13,
        minZoom: 9,
        maxZoom: 19,
        boxZoom: true,
        layers: [googleHybrid, allLayers],
      });

      // Creating scale control
      var scale = L.control.scale();
      scale.addTo(map);

      const testLayer = L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
          let poleMarker = {
            fillColor: "#008000",
            color: "#008000",
            fillOpacity: 1,
            opacity: 0.8,
            weight: 1,
            radius: 6
          }
          return L.circleMarker(latlng, poleMarker);
        }
      })

      testLayer.addTo(map);*/
    });
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

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
