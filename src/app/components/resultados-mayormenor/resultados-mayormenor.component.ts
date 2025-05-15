import { Component} from '@angular/core';
import { TablaSimpleComponent } from '../tabla-simple/tabla-simple.component';


@Component({
  selector: 'app-resultados-mayormenor',
  imports: [TablaSimpleComponent],
  templateUrl: './resultados-mayormenor.component.html',
  styleUrl: './resultados-mayormenor.component.css'
})
export class ResultadosMayormenorComponent {
  tablaNombre = 'puntajeMayormenor';

}
