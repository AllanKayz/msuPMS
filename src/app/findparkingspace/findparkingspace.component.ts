import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { DataService } from '../data.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ParkingSlotsService } from '../parking-slots.service';

@Component({
  selector: 'app-findparkingspace',
  templateUrl: './findparkingspace.component.html',
  styleUrls: ['./findparkingspace.component.css']
})

export class FindparkingspaceComponent implements OnInit, OnDestroy {
  private map: any;
  private parkSlots: any;
  private buildings: any;
  private roads: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private dataService: DataService, private parkingSlotsService: ParkingSlotsService) { }

  private initMap(): void {
    //const allLayers = L.layerGroup();

    const googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], attribution: '&copy; <a href="https//www.google.com/permissions">Google Maps</a>' }),
      googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], attribution: '&copy; <a href="https//www.google.com/permissions">Google Maps</a>' }),
      googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], attribution: '&copy; <a href="https//www.google.com/permissions">Google Maps</a>' }),
      googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], attribution: '&copy; <a href="https//www.google.com/permissions">Google Maps</a>' }),
      OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}{x}{y}.png', { attribution: '&copy; <a href="https//www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' });

    this.map = L.map('map', {
      center: [-19.516677, 29.840033],
      zoom: 15,
      minZoom: 9,
      maxZoom: 20,
      boxZoom: true,
      layers: [googleHybrid]
    })

    // Creating scale control
    const scale = L.control.scale();
    scale.addTo(this.map);

    // Add Layer Control to map
    let baseMaps = {
      "Google Satellite": googleSat,
      "Google Hybrid": googleHybrid,
      "Google Terrain": googleTerrain,
      "Google Streets": googleStreets,
      "Open Street Map": OSM
    }

    L.control.layers(baseMaps).addTo(this.map);

  }

  ngOnInit(): void {
    // Initialize the map container
    this.initMap();

    // Get Parking Slots Data
    this.parkingSlotsService.getParkingSlots().pipe(takeUntil(this.destroy$)).subscribe(slots => {
      this.parkSlots = slots;
      this.initParkingSlotsLayer();
    });

    this.parkingSlotsService.getBuildings().pipe(takeUntil(this.destroy$)).subscribe(building => {
      this.buildings = building;
      this.initBuildingsLayer();
    });

    this.parkingSlotsService.getRoads().pipe(takeUntil(this.destroy$)).subscribe(roads => {
      this.roads = roads;
      this.initRoadsLayer();
    });

  }

  // Building Styling
  private initBuildingsLayer() {
    const buildingLayer = L.geoJSON(this.buildings, {
      style: (feature) => ({
        weight: 2,
        opacity: 1,
        color: '#000000',
        fillOpacity: 0.8,
        fillColor: '#ccc'
      })
    });
    this.map.addLayer(buildingLayer);

    //this.map.addOverlay(buildingLayer, 'Buildings');
  }

  // Roads Styling 
  private initRoadsLayer() {
    const raodsLayer = L.geoJSON(this.roads, {
      style: (feature) => ({
        weight: 4,
        color: 'red'
      })
    });
  }

  // Parking Slots Styling
  private initParkingSlotsLayer() {
    let slotsLayer = L.geoJSON(this.parkSlots, {
      style: (feature: any): any => {
        let fillClr = '';
        switch (feature.properties.status) {
          case 'VIP':
            fillClr = '#ff0000';
            break;
          case 'RESERVED':
            fillClr = '#000080';
            break;
          case 'OCCUPIED':
            fillClr = '#800080';
            break;
          default:
            fillClr = '#008000';
            break;
        }

        return {
          weight: 3,
          opacity: 0.5,
          color: '#008f68',
          fillOpacity: 0.4,
          fillColor: fillClr
        }
      },
      onEachFeature: (feature, layer) => (
        layer.on({
          click: (e) => (this.layerClick(e)),
          //mouseover: (e) => (this.highlightFeature(e)),
          //mouseout: (e) => (this.resetFeature(e))
        })
      )
    });
    this.map.addLayer(slotsLayer);
  }

  // Highlight feature event
  private highlightFeature(e: any) {
    let layer = e.target;
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
    let layer = e.target;
    /*
    layer.setStyle({
      weight: 3,
      opacity: 0.5,
      color: '#008f68',
      fillOpacity: 0.8,
      fillColor: 'red'
    })*/
  }

  bookSlot() {
    console.log('Clicked')
  }


  @ViewChild('tbodyContent') tbodyContent: any;

  // bind popup o layer click
  private layerClick(e: any) {
    let layer = e.target;
    if (layer.feature.properties.status == "VACCANT") {
      console.log(this.tbodyContent.nativeElement);
      layer.bindPopup('<h3>This slot is' + '\t' + layer.feature.properties.status + '</h3><br/><button #bookSlot class="bookSlot btn btn-outline-primary">Book Into It</button>');
    }
    else {
      layer.bindPopup('<h3>This slot is ' + '\t' + layer.feature.properties.status + '</h3>');
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
