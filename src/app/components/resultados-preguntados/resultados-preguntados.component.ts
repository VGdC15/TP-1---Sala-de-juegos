import { Component } from '@angular/core';
import { TablaConTiempoComponent } from '../tabla-con-tiempo/tabla-con-tiempo.component';

@Component({
  selector: 'app-resultados-preguntados',
  imports: [TablaConTiempoComponent],
  templateUrl: './resultados-preguntados.component.html',
  styleUrl: './resultados-preguntados.component.css'
})
export class ResultadosPreguntadosComponent {
  tablaNombre = 'puntajePreguntados';

}
