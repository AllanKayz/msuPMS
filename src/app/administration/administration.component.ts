import { Component, OnInit, ViewChild } from '@angular/core';
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
  private buildings: any;
  private roads: any;
  private parkSlots: any;
  private baseMaps: any;
  private overlays: any;
  private buildingLayer: any;
  private roadLayer: any;
  private slotsLayer: any;
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
      center: [-19.516677, 29.840033],
      zoom: 17,
      minZoom: 10,
      maxZoom: 23,
      boxZoom: true,
      layers: [googleHybrid, allLayers],
    })

    // Creating scale control
    var scale = L.control.scale();
    scale.addTo(this.map);

    // Add Layer Control to map
    this.baseMaps = {
      "Google Satellite": googleSat,
      "Google Hybrid": googleHybrid,
      "Google Terrain": googleTerrain,
      "Google Streets": googleStreets,
      "Open Street Map": OSM
    }
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
    this.buildingLayer = L.geoJSON(this.buildings, {
      style: (feature) => ({
        weight: 2,
        opacity: 1,
        color: '#000000',
        fillOpacity: 0.8,
        fillColor: '#ccc'
      })
    });
    this.map.addLayer(this.buildingLayer);

    let overlay = {
      "Buildings": this.buildingLayer,
    }

    L.control.layers(this.baseMaps, overlay).addTo(this.map);
  }

  // Roads Styling 
  private initRoadsLayer() {
    this.roadLayer = L.geoJSON(this.roads, {
      style: (feature) => ({
        weight: 4,
        color: 'red'
      })
    });
  }

  //Parking Slots Styling
  private initParkingSlotsLayer() {
    this.slotsLayer = L.geoJSON(this.parkSlots, {
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
    this.map.addLayer(this.slotsLayer);
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


  @ViewChild('attrTable') attrTable: any;
  @ViewChild('tbodyContent') tbodyContent: any;

  private attributes: any;
  private layerID: number = 0;
  // bind popup on layer click
  private layerClick(e: any) {
    let layer = e.target;
    this.attributes = layer.feature.properties;

    // control visibility of the attribute table
    this.attrTable.nativeElement.classList.remove('hide');

    // add attributes data of the clicked item to table
    let data: any = '';
    for (let key in this.attributes) {
      data += ('<tr class="center aligned"><td>' + key + '</td><td>' + this.attributes[key] + '</td></tr>');
    }
    this.tbodyContent.nativeElement.innerHTML = data;
    this.layerID = this.attributes.id;
    this.map.panTo(e.latlng);
  }

  private vip: string = 'VIP';
  private reserved: string = 'RESERVED';
  private vaccant: string = 'VACCANT';
  private occupy: string = 'OCCUPIED';

  // Button reserve all slots click event
  onReserveAllSlots() {
    const reserve = this.parkingSlotsService.allSlotStatus(this.reserved);
    reserve.subscribe(data => {
      window.alert(data);
    });
    location.reload(true)
  }

  // Button make all slots VIP event
  onAllSlotsVIP() {
    const vipAll = this.parkingSlotsService.allSlotStatus(this.vip);
    vipAll.subscribe(data => {
      window.alert(data);
    });
    location.reload(true);
  }

  // Button all slots vacant event
  onAllSlotsVacant() {
    const allVaccant = this.parkingSlotsService.allSlotStatus(this.vaccant);
    allVaccant.subscribe(data => {
      window.alert(data);
    });
    location.reload(true);
  }

  vaccantSlot() {
    const vcnt = this.parkingSlotsService.updateSlotState(this.layerID, this.vaccant);
    vcnt.subscribe(data => {
      window.alert(data);
    });
    location.reload(true);
  }

  vipSlot() {
    const vip = this.parkingSlotsService.updateSlotState(this.layerID, this.vip);
    vip.subscribe(data => {
      window.alert(data);
    });
    location.reload(true);
  }

  reserveSlot() {
    const resvd = this.parkingSlotsService.updateSlotState(this.layerID, this.reserved);
    resvd.subscribe(data => {
      window.alert(data);
    });
    location.reload(true);
  }

  occupySlot() {
    const ocpy = this.parkingSlotsService.updateSlotState(this.layerID, this.occupy);
    ocpy.subscribe(data => {
      window.alert(data);
    });
    location.reload(true);
  }

  closeAttrTable() {
    this.attrTable.nativeElement.classList.add('hide');
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
