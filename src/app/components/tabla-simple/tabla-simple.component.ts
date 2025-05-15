import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit, Input } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service'; 
import { ResultadoSimple } from '../../clase/resultado-simple'; 

@Component({
  selector: 'app-tabla-simple',
  templateUrl: './tabla-simple.component.html',
  styleUrls: ['./tabla-simple.component.css']
})
export class TablaSimpleComponent implements AfterViewInit {
  @Input() tabla: string = '';
  @ViewChild('tbodyRef', { static: true }) tbodyRef!: ElementRef<HTMLTableSectionElement>;

  constructor(
    private supabaseService: SupabaseService,
    private renderer: Renderer2
  ) {}

  async ngAfterViewInit() {
    const puntajes = await this.supabaseService.obtenerPuntajesSinTiempo(this.tabla);
  
    for (let i = 0; i < 5; i++) {
      const item = puntajes[i]; // puede ser undefined
  
      const fila = this.renderer.createElement('tr');
      const emailTd = this.renderer.createElement('td');
      const puntajeTd = this.renderer.createElement('td');
  
      emailTd.textContent = item?.email || '';
      puntajeTd.textContent = item?.puntaje?.toString() || '';
  
      this.renderer.appendChild(fila, emailTd);
      this.renderer.appendChild(fila, puntajeTd);

      this.renderer.appendChild(this.tbodyRef.nativeElement, fila);
    }
  }
  
}
