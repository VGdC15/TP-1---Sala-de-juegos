import { Component, inject, signal, OnDestroy } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Mensaje } from '../../clase/mensaje';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({ 
  selector: 'app-chat',
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnDestroy {
  supabase = inject(SupabaseService);
  chat = signal<Mensaje[]>([]);
  auth = inject(AuthService);

  nuevoMensaje: string = '';
  usuarioActualId = signal<string>('');
  emailUsuario = signal<string>('');

  private subscripcion: any; 

  constructor() {
    const usuario = this.auth.usuario(); 

    // Obtener usuario logueado
    this.supabase.supabase.auth.getUser().then(async ({ data, error }) => {
      if (data.user) {
        const uuid = data.user.id;

        const { data: usuarios, error: errorUsuarios } = await this.supabase.supabase
          .from('usuarios')
          .select('id, email')
          .eq('id', uuid)
          .single();

        if (usuarios) {
          this.usuarioActualId.set(usuarios.id);
          this.emailUsuario.set(usuario?.email ?? 'Sin email');

          // Si hay una suscripción activa, la desconectamos antes de volver a suscribirnos
          if (this.subscripcion) {
            this.subscripcion.unsubscribe();
          }

          // Escuchar nuevos mensajes
          this.subscripcion = this.supabase.canal.on("postgres_changes", {
            event: "INSERT",
            schema: 'public',
            table: 'chat'
          }, (payload) => {
            const array: Mensaje[] = this.chat();
            array.push(payload.new as Mensaje);
            this.chat.set([...array]);
          });

          this.subscripcion.subscribe();
        } else {
          console.error("No se encontró el usuario en la tabla usuarios", errorUsuarios);
        }
      } else {
        console.error("Usuario no logueado o error:", error);
      }
    });

    // Traer mensajes
    this.supabase.traer().then((response) => {
      if (response !== null) {
        this.chat.set([...response]);
      }
    });
  }

  enviarMensaje() {
    if (!this.nuevoMensaje.trim()) return;
  
    const mensaje: Mensaje = {
      mensaje: this.nuevoMensaje,
      created_at: new Date(),
      usuarios: { id: this.usuarioActualId(), email: this.emailUsuario() },
    };
  
    this.supabase.crear(mensaje, this.usuarioActualId()).then(() => {
      this.nuevoMensaje = '';
      this.supabase.traer().then((response) => {

        this.chat.set([...response]);  
        
      });
    });
  }
  

  //Cierra suscripción
  ngOnDestroy(): void {
    if (this.subscripcion) {
      this.subscripcion.unsubscribe();  
    }
  }
}
