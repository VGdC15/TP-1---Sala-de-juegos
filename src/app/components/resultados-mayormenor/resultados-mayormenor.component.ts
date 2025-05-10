import { Component, inject, signal, OnDestroy } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-resultados-mayormenor',
  imports: [],
  templateUrl: './resultados-mayormenor.component.html',
  styleUrl: './resultados-mayormenor.component.css'
})
export class ResultadosMayormenorComponent implements OnDestroy{
  supabase = inject(SupabaseService);
  auth = inject(AuthService);

  puntajes = signal<any[]>([]);
  puntaje: number = 0;
  tiempo: number = 0;

  emailUsuario = signal<string>('');
  private subscripcion: any;

  constructor() {
    const usuario = this.auth.usuario(); 
    
    // Obtener usuario actual
    this.supabase.supabase.auth.getUser().then(async ({ data, error }) => {
      if (data.user) {
        this.emailUsuario.set(data.user.email ?? 'sin-email');

        // Traer puntajes ya existentes
        this.traerPuntajes();

        // Escuchar cambios en la tabla puntajeMayormenor
        this.subscripcion = this.supabase.canal.on("postgres_changes", {
          event: "INSERT",
          schema: 'public',
          table: 'puntajeMayormenor'
        }, (payload) => {
          console.log("Nuevo puntaje:", payload.new);
          const array = this.puntajes();
          array.push(payload.new);
          this.puntajes.set([...array]);
        });

        this.subscripcion.subscribe();
      }
    });
  }

  async guardarPuntaje() {
    const { error } = await this.supabase.supabase.from('puntajeMayormenor').insert({
      email: this.emailUsuario(),
      puntaje: this.puntaje,
      tiempo: this.tiempo
    });

    if (error) {
      console.error("Error al guardar puntaje", error);
    } else {
      this.puntaje = 0;
      this.tiempo = 0;
    }
  }

  async traerPuntajes() {
    const { data, error } = await this.supabase.supabase
      .from('puntajeMayormenor')
      .select('*');

    if (data) {
      this.puntajes.set(data);
    } else {
      console.error("Error al traer puntajes", error);
    }
  }

  ngOnDestroy(): void {
    if (this.subscripcion) {
      this.subscripcion.unsubscribe();
    }
  }


}
