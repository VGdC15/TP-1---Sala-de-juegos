import { Injectable } from '@angular/core';
import { Celda } from '../clase/celda';
import { Barco } from '../clase/barco';

@Injectable({
  providedIn: 'root'
})
export class BatallaService {
  tamañoTablero = 10;

  tableroJugador: Celda[][] = [];
  tableroBot: Celda[][] = [];

  barcosJugador: Barco[] = [];
  barcosBot: Barco[] = [];

  modoAcecho: boolean = false;
  coordenadasPendientes: { x: number, y: number }[] = [];
  coordenadasAtacadasBot: Set<string> = new Set(); // para evitar que el bot repita ataques

  constructor() {
    this.inicializarTableros();
    this.colocarBarcos(this.tableroJugador, this.barcosJugador);
    this.colocarBarcos(this.tableroBot, this.barcosBot);
  }

  inicializarTableros(): void {
    this.tableroJugador = [];
    this.tableroBot = [];

    for (let x = 0; x < this.tamañoTablero; x++) {
      const filaJugador: Celda[] = [];
      const filaBot: Celda[] = [];

      for (let y = 0; y < this.tamañoTablero; y++) {
        filaJugador.push(new Celda(x, y, false, false));
        filaBot.push(new Celda(x, y, false, false));
      }

      this.tableroJugador.push(filaJugador);
      this.tableroBot.push(filaBot);
    }
  }

  colocarBarcos(tablero: Celda[][], listaBarcos: Barco[]): void {
    const tamañosBarcos = [4, 3, 3, 2, 2]; // ejemplo

    for (let tamaño of tamañosBarcos) {
      let colocado = false;

      while (!colocado) {
        const x = Math.floor(Math.random() * this.tamañoTablero);
        const y = Math.floor(Math.random() * this.tamañoTablero);
        const horizontal = Math.random() < 0.5;

        const coordenadas: { x: number; y: number }[] = [];

        for (let i = 0; i < tamaño; i++) {
          const posX = horizontal ? x + i : x;
          const posY = horizontal ? y : y + i;

          if (
            posX >= this.tamañoTablero ||
            posY >= this.tamañoTablero ||
            tablero[posX][posY].tieneBarco
          ) {
            break;
          }

          coordenadas.push({ x: posX, y: posY });
        }

        if (coordenadas.length === tamaño) {
          coordenadas.forEach(coord => {
            tablero[coord.x][coord.y].tieneBarco = true;
          });

          listaBarcos.push(new Barco(tamaño, coordenadas, false));
          colocado = true;
        }
      }
    }
  }

  atacarCelda(tablero: Celda[][], barcos: Barco[], x: number, y: number): string {
    const celda = tablero[x][y];
  
    if (celda.fueAtacada) {
      return 'ya-atacada';
    }
  
    celda.fueAtacada = true;
  
    if (celda.tieneBarco) {
      const fueHundido = this.verificarHundimiento(celda, barcos, tablero);
      return fueHundido ? 'hundido' : 'impacto';
    }
  
    return 'agua';
  }
  

  verificarHundimiento(celda: Celda, barcos: Barco[], tablero: Celda[][]): boolean {
    for (let barco of barcos) {
      if (barco.coordenadas.some(coord => coord.x === celda.x && coord.y === celda.y)) {
        const hundido = barco.coordenadas.every(coord => tablero[coord.x][coord.y].fueAtacada);
        if (!barco.hundido && hundido) {
          barco.hundido = true;
          return true;
        }
      }
    }
    return false;
  }
  

  obtenerCelda(x: number, y: number, tablero: Celda[][]): Celda {
    return tablero[x][y];
  }

  turnoBot(): { x: number, y: number, resultado: string } {
    let x: number, y: number, clave: string;
  
    if (this.modoAcecho && this.coordenadasPendientes.length > 0) {
      // Modo ACECHO
      const siguiente = this.coordenadasPendientes.shift();
      if (!siguiente) return this.turnoBot(); 
  
      x = siguiente.x;
      y = siguiente.y;
      clave = `${x},${y}`;
  
      // Si ya fue atacada, probar otra
      if (this.coordenadasAtacadasBot.has(clave)) {
        return this.turnoBot();
      }
    } else {
      // Modo CAZA (aleatorio)
      do {
        x = Math.floor(Math.random() * this.tamañoTablero);
        y = Math.floor(Math.random() * this.tamañoTablero);
        clave = `${x},${y}`;
      } while (this.coordenadasAtacadasBot.has(clave));
    }
  
    // Atacar
    this.coordenadasAtacadasBot.add(clave);
    const resultado = this.atacarCelda(this.tableroJugador, this.barcosJugador, x, y);
  
    // Lógica de modoAcecho
    if (resultado === 'impacto') {
      this.modoAcecho = true;
      this.agregarAdyacentes(x, y);
    } else if (resultado === 'hundido') {
      this.modoAcecho = false;
      this.coordenadasPendientes = [];
    }
  
    return { x, y, resultado };
  }

  agregarAdyacentes(x: number, y: number): void {
    const direcciones = [
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 }
    ];
  
    for (const dir of direcciones) {
      const nx = x + dir.dx;
      const ny = y + dir.dy;
  
      if (
        nx >= 0 && nx < this.tamañoTablero &&
        ny >= 0 && ny < this.tamañoTablero &&
        !this.coordenadasAtacadasBot.has(`${nx},${ny}`)
      ) {
        this.coordenadasPendientes.push({ x: nx, y: ny });
      }
    }
  }
  
  
}
