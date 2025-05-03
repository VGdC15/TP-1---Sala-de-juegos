import { Component, signal } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.css'
})
export class AhorcadoComponent {
  abecedario = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  palabrasDisponibles = [
    'INCREIBLE', 'PRIMAVERA', 'CASCADA', 'AVENTURA', 'EXPERIENCIA', 'ENIGMA', 'MISTERIO',
    'JARDIN', 'ADIVINANZA', 'GALAXIA', 'COORDINAR', 'QUIMICA',
    'CONQUISTA', 'DIVERSION', 'INVISIBLE', 'DESAFIO', 'HORIZONTE',
    'CONEXION', 'NAVEGAR', 'ESPEJISMO', 'IMAGINAR', 'DESTINO', 'BIBLIOTECA', 'RUMOROSO',
    'TURBULENCIA', 'CEFALO', 'SORPRENDENTE', 'FANTASIA', 'EXPERIMENTO', 'VIRTUALIDAD',
    'APRENDIZAJE', 'TEMPESTAD', 'SOMBRERO', 'INTELIGENTE', 'FUSION', 'ANALISIS',
    'FOTOGRAFIA', 'CIENCIA', 'HIPOTESIS', 'RAIZ', 'LUMINOSO', 'LABERINTO', 'MARIPOSA',
    'CREATIVO', 'BUSQUEDA', 'CONSTANTE', 'CURIOSIDAD', 'VIAJE', 'COMUNICAR', 'NAVEGANTE',
    'DINAMICO', 'PATRIMONIO', 'CULTURA', 'IMAGEN', 'RUTA', 'ESCOLHA'
  ];  
  
  palabraSecreta = signal(this.elegirPalabraRandom());
  letrasAdivinadas = signal<Set<string>>(new Set());
  letrasErradas = signal<Set<string>>(new Set());
  errores = signal(0);
  estadoJuego = signal<'jugando' | 'ganado' | 'perdido'>('jugando');

  ngOnInit(): void {
    Swal.fire({
      title: '¿Cómo se juega?',
      html: `
        <p style="text-align:center; color:#f8f8f2">
        - Tenés que adivinar la palabra oculta letra por letra.<br>
        - Cada error suma una parte del dibujo del ahorcado.<br>
        - ¡Pensá bien cada letra y mucha suerte!
        </p>
      `,
      icon: 'info',
      confirmButtonText: '¡A jugar!',
      background: '#1e1e2f',
      color: '#f8f8f2',
      confirmButtonColor: 'rgb(200, 27, 253)', 
      iconColor: 'orange',
      width: '420px'
    });
  }

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



