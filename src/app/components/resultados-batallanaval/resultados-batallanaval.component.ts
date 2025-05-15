import { Component } from '@angular/core';
import { TablaSimpleComponent } from '../tabla-simple/tabla-simple.component';

@Component({
  selector: 'app-resultados-batallanaval',
  imports: [TablaSimpleComponent],
  templateUrl: './resultados-batallanaval.component.html',
  styleUrls: ['./resultados-batallanaval.component.css']
})
export class ResultadosBatallanavalComponent {
  tablaNombre = 'puntajeBatallanaval';

}
