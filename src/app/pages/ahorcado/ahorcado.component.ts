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
    'TURBULENCIA', 'CEFALO', 'FANTASIA', 'EXPERIMENTO', 'VIRTUALIDAD',
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

  intervalo: any;
  puntaje = signal(0);
  tiempo = signal(0);

  ngOnInit(): void {
    this.iniciarJuego();
    Swal.fire({
      title: '¿Cómo se juega?',
      html: `
        <p style="text-align:center; color:#f8f8f2">
          - Tenés que adivinar la palabra oculta letra por letra.<br>
          - Cada error suma una parte del dibujo del ahorcado.<br>
          - Cuanto más rápido respondas,<br>¡más puntaje sumás!<br>
          ¡Pensá bien cada letra y mucha suerte!
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
      this.puntaje.update(p => p + 100);
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
      this.terminarJuego();
      this.guardarResultado();
    }
  }

  verificarPerdedor() {
    if (this.errores() >= 6) { 
      this.estadoJuego.set('perdido');
      this.terminarJuego();
      this.guardarResultado();
    }
  }

  guardarResultado() {
    if (this.estadoJuego() === 'ganado') {
      Swal.fire({
        title: '¡Ganaste!',
        html: `<div style="text-align:center; font-size: 16px;">
                 Puntaje: ${this.puntaje()}<br>
                 Tiempo: ${this.tiempo()} segundos
               </div>`,
        icon: 'success',
        confirmButtonText: 'Seguir jugando',
        background: '#1e1e2f',
        color: '#f8f8f2',
        confirmButtonColor: 'rgb(27, 253, 130)',
        iconColor: 'limegreen',
        width: '420px'
      }).then(result => {
        if (result.isConfirmed) {
          this.reiniciarJuego(true); // continuar jugando
        } 
      });
    } else {
      Swal.fire({
        title: 'Perdiste',
        html: `<div style="text-align:center; font-size: 16px;">
                 La palabra era: <strong>${this.palabraSecreta()}</strong><br>
                 Puntaje: ${this.puntaje()}<br>
                 Tiempo: ${this.tiempo()} segundos
               </div>`,
        icon: 'error',
        confirmButtonText: 'Volver a jugar',
        background: '#1e1e2f',
        color: '#f8f8f2',
        confirmButtonColor: 'rgb(200, 27, 253)',
        iconColor: 'crimson',
        width: '420px'
      }).then(() => {
        this.reiniciarJuego(false); // siempre reinicia completo al perder
      });
    }
  }
  
  
  reiniciarJuego(continuar: boolean) {
    this.palabraSecreta.set(this.elegirPalabraRandom());
    this.letrasAdivinadas.set(new Set());
    this.letrasErradas.set(new Set());
    this.errores.set(0);
    this.estadoJuego.set('jugando');
  
    if (!continuar) {
      // Reiniciar puntaje y tiempo
      this.puntaje.set(0);
      this.tiempo.set(0);
    }
  
    clearInterval(this.intervalo);
    this.intervalo = setInterval(() => {
      this.tiempo.update(t => t + 1);
    }, 1000);
  }
  
  

  elegirPalabraRandom() {
    const indice = Math.floor(Math.random() * this.palabrasDisponibles.length);
    return this.palabrasDisponibles[indice];
  }

  iniciarJuego() {
    this.tiempo.set(0);
    this.puntaje.set(0);

    if (this.intervalo) clearInterval(this.intervalo);

    this.intervalo = setInterval(() => {
      this.tiempo.update(t => t + 1);
    }, 1000);
  }

  terminarJuego() {
    clearInterval(this.intervalo);
    const penalidad = 5;
    const nuevoPuntaje = Math.max(0, 1000 - this.tiempo() * penalidad);
    this.puntaje.set(nuevoPuntaje);
  }

}
