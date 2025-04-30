import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartasService {
  http = inject(HttpClient);

  idBaraja: string = '';
  cartaActual: any;

  constructor() {}

  crearBaraja(): Observable<any> {
    return this.http.get<any>('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
  }

  sacarCarta(): Observable<any> {
    return this.http.get<any>(`https://deckofcardsapi.com/api/deck/${this.idBaraja}/draw/?count=1`);
  }
}

