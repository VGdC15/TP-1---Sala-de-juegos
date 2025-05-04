import { Component, OnInit, inject, signal } from '@angular/core';
import { CartasService } from '../../services/cartas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [],
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.css'
})
export class MayorMenorComponent implements OnInit {
  private cartasService = inject(CartasService);

  imagen = signal('');
  puntaje = signal(0);
  resultado = signal('');
  private previousValue = 0;
  vidas = signal(3);

  ngOnInit(): void {

    Swal.fire({
      title: '¿Cómo se juega?',
      html: `
        <p style="text-align:center; color:#f8f8f2">
          Se mostrará una carta al azar.<br>
           Debés adivinar si la próxima carta será Mayor, Menor o Igual.<br>
           Si acertás:<br>
        - Ganás 100 puntos si elegís correctamente Mayor o Menor.<br>
        - Ganás 500 puntos si acertás que es Igual.<br>
        - Si fallás: perdés una vida.<br>
        - El valor de las cartas es:<br>
        A = 1 | J = 11 | Q = 12 | K = 13<br>
        ¡Buena suerte!<br>
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

    this.cartasService.crearBaraja().subscribe(res => {
      this.cartasService.idBaraja = res.deck_id;
      this.sacarCartaInicial();
    });
  }


  sacarCartaInicial() {
    this.cartasService.sacarCarta().subscribe(res => {
      const carta = res.cards[0];
      this.imagen.set(carta.image);
      this.previousValue = this.valorNumerico(carta.value);
    });
  }

  adivinar(mayor: boolean, igual: boolean = false) {
    this.cartasService.sacarCarta().subscribe(res => {
      const carta = res.cards[0];
      const nuevoValor = this.valorNumerico(carta.value);
      this.imagen.set(carta.image);
  
      if (igual) {
        if (nuevoValor === this.previousValue) {
          this.resultado.set('¡Correcto, Igual!');
          this.puntaje.update(p => p + 500);
        } else {
          this.resultado.set('Incorrecto :(');
          this.vidas.update(v => v - 1);
        }
      } else {
        if ((mayor && nuevoValor > this.previousValue) || (!mayor && nuevoValor < this.previousValue)) {
          this.resultado.set('¡Correcto!');
          this.puntaje.update(p => p + 100);
        } else {
          this.resultado.set('Incorrecto :(');
          this.vidas.update(v => v - 1);
        }
      }
  
      this.previousValue = nuevoValor;
      if (this.vidas() <= 0) {
        Swal.fire({
          title: '¡Perdiste!',
          html: `<p style="text-align:center; color:#f8f8f2">Tu puntaje final fue: <strong>${this.puntaje()}</strong></p>`,
          confirmButtonText: 'Volver a jugar',
          background: '#1e1e2f',
          color: '#f8f8f2',
          confirmButtonColor: 'rgb(200, 27, 253)',
          icon: 'error',
          iconColor: 'orange',
          width: '420px'
        }).then(() => {
          this.reiniciarJuego();
        });
      }
    });
  }
  
  

  valorNumerico(valor: string): number {
    if (!isNaN(Number(valor))) return Number(valor);
    switch (valor) {
      case 'ACE': return 1;
      case 'JACK': return 11;
      case 'QUEEN': return 12;
      case 'KING': return 13;
      default: return 0;
    }
  }

  reiniciarJuego() {
    this.puntaje.set(0);
    this.resultado.set('');
    this.vidas.set(3);
    this.sacarCartaInicial();
  } 
  
}
