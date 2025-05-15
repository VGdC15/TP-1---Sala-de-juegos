import { Component} from '@angular/core';
import { TablaConTiempoComponent } from '../tabla-con-tiempo/tabla-con-tiempo.component';

@Component({
  selector: 'app-resultados-ahorcado',
  imports: [TablaConTiempoComponent],
  templateUrl: './resultados-ahorcado.component.html',
  styleUrl: './resultados-ahorcado.component.css'
})
export class ResultadosAhorcadoComponent{
  tablaNombre = 'puntajeAhorcado';
  
}


