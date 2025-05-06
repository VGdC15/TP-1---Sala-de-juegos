import { Component, inject, signal } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Mensaje } from '../../clase/mensaje';
import { UsuarioChat } from '../../usuario-chat';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-chat',
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  supabase = inject(SupabaseService);
  chat = signal<Mensaje[]>([]);

  nuevoMensaje: string = '';
  usuarioActualId: string = '';
  usuarioActualNombre: string = '';

  constructor() {
    //Obtener usuario logueado
    this.supabase.supabase.auth.getUser().then(async ({ data, error }) => {
      if (data.user) {
        const uuid = data.user.id;
  
        // Busca el usuario en la tabla `usuarios` con  UUID
        const { data: usuarios, error: errorUsuarios } = await this.supabase.supabase
          .from('usuarios')
          .select('id, nombre')
          .eq('uuid', uuid) 
          .single();
  
        if (usuarios) {
          this.usuarioActualId = usuarios.id; 
          this.usuarioActualNombre = usuarios.nombre ?? 'Sin nombre';
        } else {
          console.error("No se encontró el usuario en la tabla usuarios", errorUsuarios);
        }
      } else {
        console.error("Usuario no logueado o error:", error);
      }
    });

    //Traer mensajes
    this.supabase.traer().then((response) => {
      if (response !== null) {
        this.chat.set([...response]);
      }
    });

    //Escuchar nuevos mensajes
    const subscripcion = this.supabase.canal.on("postgres_changes", {
      event: "INSERT",
      schema: 'public',
      table: 'chat'
    }, (payload) => {
      const array: Mensaje[] = this.chat();
      array.push(payload.new as Mensaje);
      this.chat.set([...array]);
    });

    subscripcion.subscribe();
  }

  enviarMensaje() {
    if (!this.nuevoMensaje.trim()) return;

    const mensaje: Mensaje = {
      mensaje: this.nuevoMensaje,
      created_at: new Date(),
      usuarios: [{
        id: this.usuarioActualId,
        nombre: this.usuarioActualNombre,
        created_at: new Date()
      }]
    };

    this.supabase.crear(mensaje, this.usuarioActualId).then(() => {
      this.nuevoMensaje = '';
      this.supabase.traer().then((response) => {
        if (response !== null) {
          this.chat.set([...response]);
        }
      });
    });
  }
}


// import { Component, inject, signal } from '@angular/core';
// import { SupabaseService } from '../../services/supabase.service';
// import { Mensaje } from '../../clase/mensaje';
// import { UsuarioChat } from '../../usuario-chat';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-chat',
//   imports: [FormsModule],
//   templateUrl: './chat.component.html',
//   styleUrl: './chat.component.css'
// })
// export class ChatComponent {
//   supabase = inject(SupabaseService);
//   chat = signal<Mensaje[]>([]);

//   // Cargar los mensajes inicialmente
//   constructor(){
//     this.supabase.traer().then((response) => {
//       if(response !== null) {
//         this.chat.set([...response]);
//       }
//     });

//     // Suscripción a cambios en tiempo real
//     const subscripcion = this.supabase.canal.on("postgres_changes", { event: "INSERT", schema: 'public', table: 'chat' }, (payload) => {
//       const array: Mensaje[] = this.chat();
//       array.push(payload.new as Mensaje);
//       this.chat.set([...array]);
//     });

//     subscripcion.subscribe();
//   }

//   nuevoMensaje: string = '';
//   usuarioActualId: number = 1; 
//   usuarioActualNombre: string = ''; 

//   // Enviar un nuevo mensaje
//   enviarMensaje() {
//     const mensaje: Mensaje = {
//       mensaje: this.nuevoMensaje,
//       created_at: new Date(),
//       usuarios: [{ id: this.usuarioActualId, nombre: this.usuarioActualNombre, created_at: new Date() }]
//     };
  
//     this.supabase.crear(mensaje, this.usuarioActualId).then(() => {
//       this.nuevoMensaje = ''; // limpiar input
  
//       // Refrescar lista después de insertar
//       this.supabase.traer().then((response) => {
//         if (response !== null) {
//           this.chat.set([...response]);
//         }
//       });
//     });
//   }
  
// }

