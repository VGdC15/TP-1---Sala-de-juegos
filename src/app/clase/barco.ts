export class Barco {
    tamaño: number;
    coordenadas: { x: number; y: number }[];
    hundido: boolean;
  
    constructor(tamaño: number, coordenadas: { x: number; y: number }[], hundido: boolean) {
      this.tamaño = tamaño;
      this.coordenadas = coordenadas;
      this.hundido = hundido;
    }
  }
  
