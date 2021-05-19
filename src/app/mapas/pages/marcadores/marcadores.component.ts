import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

// Interface : para almacenar color

interface MarcadorColor {
  color: string;
  marker?: mapboxgl.Marker;
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
      .mapa-container {
        width: 100% !important;
        height: 100% !important;
      }
      .list-group {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 99;
      }
      ul > li {
        cursor: pointer;
      }
    `,
  ],
})
export class MarcadoresComponent implements AfterViewInit {
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [-71.2647988421515, -32.887249084667985];

  // Arreglo de marcadores
  marcadores: MarcadorColor[] = [];

  constructor() { }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel,
    });

    // En este punto podemos leer los marcadores
    this.leerLocalSorage();

    // const markerHtml : HTMLElement = document.createElement('div');
    // markerHtml.innerHTML = 'Hola Mundo';

    // Crear Marcador, genero nueva instancia
    // new mapboxgl.Marker()
    //     .setLngLat( this.center )
    //     .addTo( this.mapa )
  }

  agregarMarcador() {
    // Generamos color aleatorio
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );

    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true, // permite mover los marcadores
      color, // es6 redundante se deja solo color en vez de color:color
    })
      .setLngLat(this.center)
      .addTo(this.mapa);

    // Insertamos en el arreglo
    this.marcadores.push({
      color,
      marker: nuevoMarcador,
    });
    // se crea el marcador
    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on('dragend', () => {
      this.guardarMarcadoresLocalStorage();
    });
  }

  irMarcador(indice: number): void {
    this.mapa.flyTo({
      center: this.marcadores[indice].marker!.getLngLat(),
    });
  }

  guardarMarcadoresLocalStorage() {
    const lngLatArr: MarcadorColor[] = [];

    this.marcadores.forEach((m) => {
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();

      lngLatArr.push({
        color: color,
        centro: [lng, lat],
      });
    });
    // guardamos en el localstorage
    localStorage.setItem('marcadores', JSON.stringify(lngLatArr));
  }

  leerLocalSorage() {
    // si marcadores en localStorage no existe

    if (!localStorage.getItem('marcadores')) {
      return;
    }

    const lngLatArr: MarcadorColor[] = JSON.parse(
      localStorage.getItem('marcadores')!
    );
    // Para mostrarlos haremos un barrido del obj
    lngLatArr.forEach((m) => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true,
      })
        .setLngLat(m.centro!)
        .addTo(this.mapa);

      // reconstruir nuestro arreglo de marcadores
      this.marcadores.push({
        marker: newMarker,
        color: m.color,
      });

      // El dragend evento se activa cuando se finaliza una operación de arrastre
      // (soltando un botón del mouse o presionando la tecla de escape).

      newMarker.on('dragend', () => {
        this.guardarMarcadoresLocalStorage();
      });
    });
  }

  borrarMarcador(indice: number) {
    // Borro marcador
    this.marcadores[indice].marker?.remove();
    // purgamos el arreglo de marcadores
    this.marcadores.splice(indice, 1);
    // purgamos el localstorage
    this.guardarMarcadoresLocalStorage();
  }
}
