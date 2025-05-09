import { Injectable, signal, computed} from '@angular/core';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root' 
})
export class AuthService {
  private supabase: SupabaseClient;
 
  usuario = signal<User | null>(null);

  // para saber si hay sesión iniciada
  isLoggedIn = computed(() => this.usuario() !== null);

  constructor() {
    this.supabase = createClient(
      "https://hrisasayvkqyawprtuuj.supabase.co", 
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyaXNhc2F5dmtxeWF3cHJ0dXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNzYxMTgsImV4cCI6MjA2MDk1MjExOH0.CW47baPNw7YVSBjGB1NbDkhkhtr4JEIQ30mXXjtVTz4"
    );
    this.supabase.auth.getSession().then(({data}) =>{
      const sesionUsuario = data.session?.user ?? null;
      this.usuario.set(sesionUsuario);
    })

    this.supabase.auth.onAuthStateChange(async(event, session) =>{
      if(session === null){
        this.usuario.set(null);

      }else {
        const sesionUsuario = session.user;
        this.usuario.set(sesionUsuario);
      }
    })


  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
    this.usuario.set(data.user);
  }

  async logout() {
    await this.supabase.auth.signOut();
    this.usuario.set(null);
  }

  async guardarUsuarioAuth(email: string, password: string, nombre: string, apellido: string, edad: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      throw error;
    }

    this.usuario.set(data.user);
    this.crearUsuarioDB(data.user!.id, email, nombre, apellido, edad);

    return data.user;
  }

  private async crearUsuarioDB(uid: string, email: string, nombre:string, apellido:string, edad: string) {
    const { data, error } = await this.supabase.from("usuarios").insert({
      id: uid,
      nombre: nombre,
      email: email,
      apellido: apellido,
      edad: edad
    });
  }

}