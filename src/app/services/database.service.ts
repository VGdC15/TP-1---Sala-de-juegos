import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Usuario } from '../clase/usuario';
import {PostgrestQueryBuilder} from '@supabase/postgrest-js';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  supabase : SupabaseClient<any, "public", any>;
  tablaUsuario: PostgrestQueryBuilder<any, any, "usuarios", unknown>;

  constructor() {
    this.supabase = createClient(
      "https://hrisasayvkqyawprtuuj.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyaXNhc2F5dmtxeWF3cHJ0dXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNzYxMTgsImV4cCI6MjA2MDk1MjExOH0.CW47baPNw7YVSBjGB1NbDkhkhtr4JEIQ30mXXjtVTz4");
      this.tablaUsuario = this.supabase.from("usuarios");
    }

    async crearUsuario(usuario: Usuario){
      const{data, error} = await this.tablaUsuario.insert([usuario]);
      console.log(data);
      console.log(error);

    }

    async listarUsuario(): Promise<Usuario[] | []> {
      const {data, error} = await this.tablaUsuario.select("email, nombre, apellido, edad");

      console.log(data);
      if(error){
        return [];
      }
      return data as Usuario[];
    }

}
 