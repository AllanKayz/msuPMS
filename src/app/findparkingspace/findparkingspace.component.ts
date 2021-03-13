import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-findparkingspace',
  templateUrl: './findparkingspace.component.html',
  styleUrls: ['./findparkingspace.component.css']
})

@ViewChild('map')

export class FindparkingspaceComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void {
    const map = L.map('map').setView([51.503, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Allan Kanyemba Things'
    }).addTo(map);

    L.marker([51.5, -0.09]).addTo(map);
  }

  ngAfterViewInit() {
  }


  /*private map: L.Map;

  @ViewChild('map')
  private mapContainer: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    const map = new L.Map(this.mapContainer.nativeElement).setView(
      [51.503, -0.09], 13
    );

    L.tileLayer()
  }*/

}
