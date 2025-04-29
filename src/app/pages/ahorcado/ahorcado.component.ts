import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.css'
})
export class AhorcadoComponent {
  abecedario = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  palabrasDisponibles = [
    'INCREÍBLE', 'PRIMAVERA', 'CASCADA', 'AVENTURA', 'EXPERIENCIA', 'ENIGMA', 'MISTERIO',
    'JARDÍN', 'ADIVINANZA', 'GALAXIA', 'COORDINAR', 'QUÍMICA',
    'CONQUISTA', 'DIVERSIÓN', 'INVISIBLE', 'DESAFÍO', 'HORIZONTE',
    'CONEXIÓN', 'NAVEGAR', 'ESPEJISMO', 'IMAGINAR', 'DESTINO', 'BIBLIOTECA', 'RUMOROSO',
    'TURBULENCIA', 'CÉFALO', 'SORPRENDENTE', 'FANTASÍA', 'EXPERIMENTO', 'VIRTUALIDAD',
    'APRENDIZAJE', 'TEMPESTAD', 'SOMBRERO', 'INTELIGENTE', 'FUSIÓN', 'ANÁLISIS',
    'FOTOGRAFÍA', 'CIENCIA', 'HIPÓTESIS', 'RAÍZ', 'LUMINOSO', 'LABERINTO', 'MARIPOSA',
    'CREATIVO', 'BÚSQUEDA', 'CONSTANTE', 'CURIOSIDAD', 'VIAJE', 'COMUNICAR', 'NAVEGANTE',
    'DINÁMICO', 'PATRIMONIO', 'CULTURA', 'IMAGEN', 'RUTA', 'ESCOLHA'
  ];  
  
  palabraSecreta = signal(this.elegirPalabraRandom());
  letrasAdivinadas = signal<Set<string>>(new Set());
  letrasErradas = signal<Set<string>>(new Set());
  errores = signal(0);
  estadoJuego = signal<'jugando' | 'ganado' | 'perdido'>('jugando');

  seleccionarLetra(letra: string) {
    if (this.estadoJuego() !== 'jugando') return;

    if (this.palabraSecreta().includes(letra)) {
      this.letrasAdivinadas().add(letra);
      this.letrasAdivinadas.set(new Set(this.letrasAdivinadas()));
      this.verificarGanador();
    } else {
      this.letrasErradas().add(letra);
      this.letrasErradas.set(new Set(this.letrasErradas()));
      this.errores.update(e => e + 1);
      this.verificarPerdedor();
    }
  }

  verificarGanador() {
    const todasLetras = new Set(this.palabraSecreta().split(''));
    const aciertos = this.letrasAdivinadas();
    if ([...todasLetras].every(letra => aciertos.has(letra))) {
      this.estadoJuego.set('ganado');
      this.guardarResultado();
    }
  }

  verificarPerdedor() {
    if (this.errores() >= 6) { 
      this.estadoJuego.set('perdido');
      this.guardarResultado();
    }
  }

  guardarResultado() {
    console.log('Guardando resultado...');
  }

  elegirPalabraRandom() {
    const indice = Math.floor(Math.random() * this.palabrasDisponibles.length);
    return this.palabrasDisponibles[indice];
  }

}



