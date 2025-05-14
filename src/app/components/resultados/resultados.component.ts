import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service'; 

@Component({
  selector: 'app-resultados',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.css'
})

export class ResultadosComponent implements OnInit {
  supabase = inject(SupabaseService);

  resultadosConTiempo = this.supabase.resultadosConTiempo;
  resultadosSimple = this.supabase.resultadosSimple;

  ngOnInit() {
    this.supabase.cargarTodosLosResultados();

    effect(() => {
      console.log('Con tiempo:', this.resultadosConTiempo());
      console.log('Sin tiempo:', this.resultadosSimple());
    });
  }
}
