import { Component, effect, inject, OnInit } from '@angular/core';
import {RouterOutlet } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service'; 
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-resultados',
  imports: [RouterOutlet, CardComponent],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.css'
})

export class ResultadosComponent {

}
