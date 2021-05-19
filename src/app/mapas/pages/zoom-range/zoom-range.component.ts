import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
    .mapa-container{
      width:100% !important;
      height:100% !important;
    }
    .row{
      background-color:white;
      border-radius:5px;
      position:fixed;
      bottom:50px;
      left:50px;
      padding:10px;
      z-index:1001;
      width:400px;
    }
    `
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef;

  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number, number] = [-71.2647988421515, -32.887249084667985];

  constructor() { 
    console.log('constructor', this.divMapa);
  }

  ngOnDestroy(){
    // destruir listerner que estoy utilizando
    this.mapa.off('zoom', ()=>{});
    this.mapa.off('zoomend', ()=>{});
    this.mapa.off('move', ()=>{});
  }

  ngAfterViewInit(): void {
    // console.log('ngAfterViewInit', this.divMapa);
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    // Creación de listener
    this.mapa.on('zoom', (ev)=>{
      this.zoomLevel = this.mapa.getZoom(); // zoomActual
    });

    this.mapa.on('zoomend', (ev)=>{
     if (this.mapa.getZoom() > 18 ) {
          this.mapa.zoomTo(18);
     }
    });

    // Movimiento On
    this.mapa.on('move', (ev) =>{
      const target = ev.target;
      const {lng,lat} = target.getCenter();
      this.center = [lng,lat];
    });
  }

  zoomOut(){
   this.mapa.zoomOut();
  }

  zoomIn(){
    this.mapa.zoomIn();
    this.zoomLevel = this.mapa.getZoom();
  }

  zoomCambio( val:string ){
    // console.log(val);
    this.mapa.zoomTo(Number(val));
  }

}
