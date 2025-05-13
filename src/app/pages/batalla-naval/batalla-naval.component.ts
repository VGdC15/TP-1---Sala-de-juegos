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

  turno = 'jugador'; // 'jugador' o 'bot'
  aciertosConsecutivos = signal(0);
  ultimoBarcoGolpeadoId: string | null = null;

  constructor(private batallaService: BatallaService) {}

  ngOnInit(): void {
    this.tableroJugador = this.batallaService.tableroJugador;
    this.tableroBot = this.batallaService.tableroBot;
  }

  jugarTurno(x: number, y: number): void {
    if (this.turno !== 'jugador') return;

    const celda = this.tableroBot[x][y];
    if (celda.fueAtacada) return;

    const resultado = this.batallaService.atacarCelda(this.tableroBot, this.batallaService.barcosBot, x, y);

    if (resultado === 'impacto') {
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
      
    } else {
      this.aciertosConsecutivos.set(0);
      this.ultimoBarcoGolpeadoId = null;
    }

    if (this.juegoTerminado()) {
      this.mostrarResultadoFinal();
      return;
    }

    this.turno = 'bot';
    setTimeout(() => this.turnoBot(), 1000);
  }

  turnoBot(): void {
    const { x, y, resultado } = this.batallaService.turnoBot();

    if (resultado === 'impacto') {
      this.puntajeBot.set(this.puntajeBot() + 10);

    }

    if (this.juegoTerminado()) {
      this.mostrarResultadoFinal();
      return;
    }

    this.turno = 'jugador';
  }

  juegoTerminado(): boolean {
    const todosHundidos = (barcos: Barco[]) => barcos.every((barco: Barco) => barco.hundido);
    return todosHundidos(this.batallaService.barcosJugador) || todosHundidos(this.batallaService.barcosBot);
  }

  mostrarResultadoFinal(): void {
    const mensaje =
      this.puntajeJugador > this.puntajeBot
        ? '¡Ganaste la batalla naval!'
        : this.puntajeJugador < this.puntajeBot
        ? 'Perdiste.'
        : 'Empate. Fue una batalla reñida.';

    Swal.fire({
      title: 'Juego terminado',
      html: `
        <p style="text-align:center; color:#f8f8f2">${mensaje}</p>
        <p style="text-align:center; color:#f8f8f2">Tu puntaje: ${this.puntajeJugador()}</p>
        <p style="text-align:center; color:#f8f8f2">Puntaje del bot: ${this.puntajeBot()}</p>
      `,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      background: '#1e1e2f',
      color: '#f8f8f2',
      confirmButtonColor: 'rgb(200, 27, 253)',
      iconColor: 'orange',
      width: '420px'
    });
  }
}

