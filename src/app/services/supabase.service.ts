import { Injectable } from '@angular/core';
import { RealtimeChannel, SupabaseClient, createClient } from '@supabase/supabase-js';
import { Mensaje } from '../clase/mensaje';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  supabase: SupabaseClient;
  canal:RealtimeChannel;

  constructor() {
    this.supabase = createClient(
      "https://hrisasayvkqyawprtuuj.supabase.co", 
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyaXNhc2F5dmtxeWF3cHJ0dXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNzYxMTgsImV4cCI6MjA2MDk1MjExOH0.CW47baPNw7YVSBjGB1NbDkhkhtr4JEIQ30mXXjtVTz4"
    );
    this.canal = this.supabase.channel("table-db-changes");
  }

  async crear(mensaje: Mensaje, id_usuario: string){
    await this.supabase.from('chat').insert({
      mensaje: mensaje.mensaje,
      created_at: mensaje.created_at,
      id_usuario: id_usuario
    });
  }
  

  async traer() {
    const { data } = await this.supabase
      .from("chat")
      .select("id, mensaje, created_at, usuarios (id, nombre)");
    
    return data as Mensaje[];
  }

}
