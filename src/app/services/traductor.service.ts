import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TraductorService {
  traducir(texto: string): Promise<string> {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=es&dt=t&q=${encodeURIComponent(texto)}`;
    return fetch(url)
      .then(res => res.json())
      .then(data => data[0][0][0]);
  }
}