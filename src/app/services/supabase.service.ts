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
  
  // async obtenerPuntajes(juego: string) {
  //   const { data, error } = await this.supabase
  //     .from(juego)
  //     .select('*')
  //     .order('puntaje', { ascending: false }); //puede ser por 'tiempo' VERRRR
  
  //   if (error) {
  //     console.error(`Error al obtener puntajes de ${juego}:`, error);
  //     return [];
  //   }
  
  //   return data;
  // }
  async obtenerPuntajesSinTiempo(juego: string) {
    const { data, error } = await this.supabase
      .from(juego)
      .select('*');
  
    if (error) {
      console.error(`Error al obtener puntajes de ${juego}:`, error);
      return [];
    }
  
    // Ordenar por puntaje descendente y tomar los 5 primeros
    return data
      .sort((a, b) => b.puntaje - a.puntaje)
      .slice(0, 5);
  }
  

  async obtenerPuntajesConTiempo(juego: string) {
    const { data, error } = await this.supabase
      .from(juego)
      .select('*');
  
    if (error) {
      console.error(`Error al obtener puntajes de ${juego}:`, error);
      return [];
    }
  
    // Calcular eficiencia (puntaje / tiempo) y convertir tiempo string a número
    const datosConEficiencia = data.map((item: any) => {
      const segundos = this.convertirTiempoASegundos(item.tiempo);
      const eficiencia = segundos > 0 ? item.puntaje / segundos : 0;
      return { ...item, eficiencia };
    });
  
    // Ordenar por eficiencia descendente y tomar los 5 primeros
    return datosConEficiencia
      .sort((a, b) => b.eficiencia - a.eficiencia)
      .slice(0, 5);
  }
  
  private convertirTiempoASegundos(tiempo: any): number {
    const tiempoStr = String(tiempo); 
    const partes = tiempoStr.split(':');
  
    if (partes.length !== 2) return Number.MAX_SAFE_INTEGER; 
  
    const minutos = parseInt(partes[0], 10);
    const segundos = parseInt(partes[1], 10);
  
    return minutos * 60 + segundos;
  }
  
  

  //PARA LAS TABLAS DE PUNTAJE
  async cargarTodosLosResultados() {
    try {
      // Juegos con tiempo
      const [ahorcado, preguntados] = await Promise.all([
        this.obtenerPuntajesConTiempo('puntajeAhorcado'),
        this.obtenerPuntajesConTiempo('puntajePreguntados'),
      ]);

      const resultadosTiempo: ResultadoConTiempo[] = [
        ...ahorcado.map((item: any) => new ResultadoConTiempo(item.email, item.puntaje, item.tiempo)),
        ...preguntados.map((item: any) => new ResultadoConTiempo(item.email, item.puntaje, item.tiempo)),
      ];
      this.resultadosConTiempo.set(resultadosTiempo);

      // Juegos simples
      const [mayorMenor, batallaNaval] = await Promise.all([
        this.obtenerPuntajesSinTiempo('puntajeMayormenor'),
        this.obtenerPuntajesSinTiempo('puntajeBatallanaval'),
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
  


