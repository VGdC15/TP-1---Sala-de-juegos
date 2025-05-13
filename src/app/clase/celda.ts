export class Celda {
    x: number;
    y: number;
    tieneBarco: boolean;
    fueAtacada: boolean;
  
    constructor(x: number, y: number, tieneBarco: boolean, fueAtacada: boolean) {
      this.x = x;
      this.y = y;
      this.tieneBarco = tieneBarco;
      this.fueAtacada = fueAtacada;
    }
}
