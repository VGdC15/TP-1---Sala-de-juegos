import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-juegos',
  imports: [RouterOutlet, CardComponent],
  templateUrl: './juegos.component.html',
  styleUrl: './juegos.component.css'
})
export class JuegosComponent {

}
