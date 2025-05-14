import { Injectable } from '@angular/core';
import { RealtimeChannel, SupabaseClient, createClient } from '@supabase/supabase-js';
import { Mensaje } from '../clase/mensaje';
import { signal, Signal } from '@angular/core';
import { ResultadoConTiempo } from '../clase/resultado-con-tiempo';
import { ResultadoSimple } from '../clase/resultado-simple';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  supabase: SupabaseClient;
  canal:RealtimeChannel;

  resultadosConTiempo = signal<ResultadoConTiempo[]>([]);
  resultadosSimple = signal<ResultadoSimple[]>([]);

  constructor() {
    this.supabase = createClient(
      "https://hrisasayvkqyawprtuuj.supabase.co", 
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyaXNhc2F5dmtxeWF3cHJ0dXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNzYxMTgsImV4cCI6MjA2MDk1MjExOH0.CW47baPNw7YVSBjGB1NbDkhkhtr4JEIQ30mXXjtVTz4"
    );
    this.canal = this.supabase.channel("table-db-changes");
  }

  // PARA CHAT
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
      .select("id, mensaje, created_at, usuarios (id, email)");
    console.log(data);
    return data as Mensaje[];
  }

  //PARA PUNTAJES
  async guardarPuntaje(
    juego: 'puntajeAhorcado' | 'puntajeMayormenor' | 'puntajePreguntados' | 'puntajeBatallanaval',
    puntaje: number,
    email: string,
    tiempo: string
  ) {
    const { error } = await this.supabase.from(juego).insert({
      puntaje,
      email,
      tiempo
    });
  
    if (error) {
      console.error(`Error al guardar puntaje en ${juego}:`, error.message || error.details || JSON.stringify(error));
    }
  }
  
  async obtenerPuntajes(juego: string) {
    const { data, error } = await this.supabase
      .from(juego)
      .select('*')
      .order('puntaje', { ascending: false }); //puede ser por 'tiempo' VERRRR
  
    if (error) {
      console.error(`Error al obtener puntajes de ${juego}:`, error);
      return [];
    }
  
    return data;
  }

  //PARA LAS TABLAS DE PUNTAJE
  async cargarTodosLosResultados() {
    try {
      // Juegos con tiempo
      const [ahorcado, preguntados] = await Promise.all([
        this.obtenerPuntajes('puntajeAhorcado'),
        this.obtenerPuntajes('puntajePreguntados'),
      ]);

      const resultadosTiempo: ResultadoConTiempo[] = [
        ...ahorcado.map((item: any) => new ResultadoConTiempo(item.email, item.puntaje, item.tiempo)),
        ...preguntados.map((item: any) => new ResultadoConTiempo(item.email, item.puntaje, item.tiempo)),
      ];
      this.resultadosConTiempo.set(resultadosTiempo);

      // Juegos simples
      const [mayorMenor, batallaNaval] = await Promise.all([
        this.obtenerPuntajes('puntajeMayormenor'),
        this.obtenerPuntajes('puntajeBatallanaval'),
      ]);

      const resultadosSimple: ResultadoSimple[] = [
        ...mayorMenor.map((item: any) => new ResultadoSimple(item.email, item.puntaje)),
        ...batallaNaval.map((item: any) => new ResultadoSimple(item.email, item.puntaje)),
      ];
      this.resultadosSimple.set(resultadosSimple);

    } catch (error) {
      console.error('Error al cargar resultados:', error);
    }
  }

}
  


