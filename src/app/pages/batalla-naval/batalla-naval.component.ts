import { Component, OnInit, signal } from '@angular/core';
import { BatallaService } from '../../services/batalla-naval.service';
import { Celda } from '../../clase/celda';
import { Barco } from '../../clase/barco';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-batalla-naval',
  templateUrl: './batalla-naval.component.html',
  styleUrls: ['./batalla-naval.component.css']
})
export class BatallaNavalComponent implements OnInit {
  tableroJugador: Celda[][] = [];
  tableroBot: Celda[][] = [];

  puntajeJugador = signal(0);
  puntajeBot = signal(0);  

  turno = signal<'jugador' | 'bot'>('jugador');
  aciertosConsecutivos = signal(0);
  ultimoBarcoGolpeadoId: string | null = null;

  barcosJugadorRestantes = signal(0);
  barcosBotRestantes = signal(0);

  aciertosBotConsecutivos = signal(0);
  ultimoBarcoGolpeadoBotId: string | null = null;


  constructor(private batallaService: BatallaService) {}

  ngOnInit(): void {
    this.reiniciarJuego();
    
    this.tableroJugador = this.batallaService.tableroJugador;
    this.tableroBot = this.batallaService.tableroBot;

    this.barcosJugadorRestantes.set(this.batallaService.barcosJugador.length);
    this.barcosBotRestantes.set(this.batallaService.barcosBot.length);

    Swal.fire({
      title: '¡Comienza la Batalla!',
      html: `
        <p style="color:#f8f8f2">Tus barcos: ${this.barcosJugadorRestantes()}</p>
        <p style="color:#f8f8f2">Barcos enemigos: ${this.barcosBotRestantes()}</p>
      `,
      icon: 'info',
      background: '#1e1e2f',
      color: '#f8f8f2',
      confirmButtonText: '¡A luchar!',
      confirmButtonColor: 'rgb(200, 27, 253)',
      iconColor: 'orange',
      width: '420px'
    });

  }

  jugarTurno(x: number, y: number): void {
    if (this.turno() !== 'jugador') return;
  
    const celda = this.tableroBot[x][y];
    if (celda.fueAtacada) return;
  
    const resultado = this.batallaService.atacarCelda(this.tableroBot, this.batallaService.barcosBot, x, y);
  
    if (resultado === 'impacto' || resultado === 'hundido') {
      this.puntajeJugador.set(this.puntajeJugador() + 100);
  
      const barcoImpactado = this.batallaService.barcosBot.find(barco =>
        barco.coordenadas.some(coord => coord.x === x && coord.y === y)
      );
  
      const barcoId = barcoImpactado ? JSON.stringify(barcoImpactado.coordenadas) : null;
  
      if (this.ultimoBarcoGolpeadoId === barcoId) {
        this.aciertosConsecutivos.update(valor => valor + 1);
        if (this.aciertosConsecutivos() > 1) {
          this.puntajeJugador.set(this.puntajeJugador() + 100); // bono por combo
        }
      } else {
        this.aciertosConsecutivos.set(1);
        this.ultimoBarcoGolpeadoId = barcoId;
      }
  
      if (resultado === 'hundido') {
        this.barcosBotRestantes.update(n => n - 1);
  
        // Mostrar mensaje en HTML
        const mensajeDiv = document.getElementById('mensaje-batalla');
        if (mensajeDiv) {
          mensajeDiv.innerHTML = `🚢 ¡Hundiste un barco enemigo! Quedan ${this.barcosBotRestantes()} por hundir.`;
          mensajeDiv.classList.add('visible');
  
          // Ocultar luego de unos segundos
          setTimeout(() => {
            mensajeDiv.classList.remove('visible');
            mensajeDiv.innerHTML = '';
          }, 4000);
        }
      }
  
    } else {
      this.aciertosConsecutivos.set(0);
      this.ultimoBarcoGolpeadoId = null;
    }
  
    if (this.juegoTerminado()) {
      this.mostrarResultadoFinal();
      return;
    }

    // const delay = Math.floor(Math.random() * 5000) + 4000; 
    // setTimeout(() => {
    //   this.turnoBot(); 
    // }, delay);
    this.turno.set('bot');
    const tiempoEspera = Math.floor(Math.random() * 2000) + 1000; // entre 1000 y 3000 ms
    setTimeout(() => this.turnoBot(), tiempoEspera);
    //setTimeout(() => this.turnoBot(), 2500);

  }
  

  turnoBot(): void {
    const { x, y, resultado } = this.batallaService.resolverTurnoBot();
  
    if (resultado === 'impacto' || resultado === 'hundido') {
      this.puntajeBot.set(this.puntajeBot() + 100);
  
      const barcoImpactado = this.batallaService.barcosJugador.find(barco =>
        barco.coordenadas.some(coord => coord.x === x && coord.y === y)
      );
  
      const barcoId = barcoImpactado ? JSON.stringify(barcoImpactado.coordenadas) : null;
  
      if (this.ultimoBarcoGolpeadoBotId === barcoId) {
        this.aciertosBotConsecutivos.update(valor => valor + 1);
        if (this.aciertosBotConsecutivos() > 1) {
          this.puntajeBot.set(this.puntajeBot() + 100); // bono por combo
        }
      } else {
        this.aciertosBotConsecutivos.set(1);
        this.ultimoBarcoGolpeadoBotId = barcoId;
      }
  
      if (resultado === 'hundido') {
        this.barcosJugadorRestantes.update(n => n - 1);
  
        const mensajeDiv = document.getElementById('mensaje-batalla');
        if (mensajeDiv) {
          mensajeDiv.innerHTML = `💥 ¡El Enemigo hundió uno de tus barcos! Te quedan ${this.barcosJugadorRestantes()} barcos.`;
          mensajeDiv.classList.add('visible');
  
          setTimeout(() => {
            mensajeDiv.classList.remove('visible');
            mensajeDiv.innerHTML = '';
          }, 4000);
        }
      }
    } else {
      this.aciertosBotConsecutivos.set(0);
      this.ultimoBarcoGolpeadoBotId = null;
    }
  
    if (this.juegoTerminado()) {
      this.mostrarResultadoFinal();
      return;
    }
  
    this.turno.set('jugador');
  }
  

  juegoTerminado(): boolean {
    const todosHundidos = (barcos: Barco[]) => barcos.every((barco: Barco) => barco.hundido);
    return todosHundidos(this.batallaService.barcosJugador) || todosHundidos(this.batallaService.barcosBot);
  }

  mostrarResultadoFinal(): void {
    let mensaje = '';
    let titulo = '';
    let icono: 'success' | 'error';
  
    if (this.barcosBotRestantes() === 0) {
      // Ganó el jugador
      mensaje = '¡Hundiste todos los barcos enemigos!';
      titulo = '¡Ganaste la batalla naval!';
      icono = 'success';
    } else if (this.barcosJugadorRestantes() === 0) {
      // Perdió el jugador
      mensaje = 'El enemigo hundió todos tus barcos.';
      titulo = 'Perdiste la batalla naval.';
      icono = 'error';
    } else {
      return;
    }
  
    Swal.fire({
      title: titulo,
      html: `
        <p style="text-align:center; color:#f8f8f2">${mensaje}</p>
        <p style="text-align:center; color:#f8f8f2">Tu puntaje: ${this.puntajeJugador()}</p>
        <p style="text-align:center; color:#f8f8f2">Puntaje del bot: ${this.puntajeBot()}</p>
      `,
      icon: icono,
      confirmButtonText: 'Volver a jugar',
      background: '#1e1e2f',
      color: '#f8f8f2',
      confirmButtonColor: 'rgb(200, 27, 253)',
      iconColor: icono === 'success' ? 'limegreen' : 'crimson',
      width: '420px',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then(() => {
      this.reiniciarJuego();
    });
  }
  

  reiniciarJuego(): void {
    this.batallaService.barcosJugador = [];
    this.batallaService.barcosBot = [];
    this.batallaService.coordenadasAtacadasBot.clear();
  
    this.batallaService.inicializarTableros();
    this.batallaService.colocarBarcos(this.batallaService.tableroJugador, this.batallaService.barcosJugador);
    this.batallaService.colocarBarcos(this.batallaService.tableroBot, this.batallaService.barcosBot);
  
    this.tableroJugador = this.batallaService.tableroJugador;
    this.tableroBot = this.batallaService.tableroBot;
  
    this.puntajeJugador.set(0);
    this.puntajeBot.set(0);
    this.turno.set('jugador');
    this.aciertosConsecutivos.set(0);
    this.ultimoBarcoGolpeadoId = null;
  
    this.barcosJugadorRestantes.set(this.batallaService.barcosJugador.length);
    this.barcosBotRestantes.set(this.batallaService.barcosBot.length);

    this.aciertosBotConsecutivos.set(0);
    this.ultimoBarcoGolpeadoBotId = null;

  }
  
  
}

