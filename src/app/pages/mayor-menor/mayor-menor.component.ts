import { Component, OnInit, inject, signal } from '@angular/core';
import { CartasService } from '../../services/cartas.service';

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

  ngOnInit() {
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
          this.resultado.set('¡Correcto! ¡Igual!');
          this.puntaje.update(p => p * 2);
        } else {
          this.resultado.set('Incorrecto :(');
          this.vidas.update(v => v - 1);
        }
      } else {
        if ((mayor && nuevoValor > this.previousValue) || (!mayor && nuevoValor < this.previousValue)) {
          this.resultado.set('¡Correcto!');
          this.puntaje.update(p => p + 1);
        } else {
          this.resultado.set('Incorrecto :(');
          this.vidas.update(v => v - 1);
        }
      }

      this.previousValue = nuevoValor;
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
