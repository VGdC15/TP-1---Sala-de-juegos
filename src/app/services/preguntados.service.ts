import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PreguntadosService {
  private apiUrl = 'https://opentdb.com/api.php';

  constructor(private http: HttpClient) {}

  obtenerPreguntas(categoria: number, dificultad: string, cantidad = 10) {
    return this.http.get<any>(`${this.apiUrl}?amount=${cantidad}&category=${categoria}&difficulty=${dificultad}&type=multiple`);
  }

  obtenerCategorias() {
    return this.http.get<any>('https://opentdb.com/api_category.php');
  }
}
