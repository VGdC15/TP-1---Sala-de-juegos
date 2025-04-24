import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GithubService {
  //injectar el servicio
  httpClient = inject(HttpClient);

  datoActual: any;

  constructor() { }
  traerDatos(usuario: string){
    // Crear petición
    const peticion: Observable<any> = this.httpClient.get<any>("https://api.github.com/users/" + usuario)

    // Suscribirse 
    const suscripcion: Subscription = peticion.subscribe((respuesta) => {
      console.log(respuesta);
      this.datoActual = respuesta; 

      // Cerrar la suscripción
      suscripcion.unsubscribe();
    });
  }
}
 