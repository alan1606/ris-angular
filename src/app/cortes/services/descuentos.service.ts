import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { Descuento } from 'src/app/models/descuento';

@Injectable({
  providedIn: 'root',
})
export class DescuentosService {
  constructor(private httpClient: HttpClient) {}

  url = `${BASE_ENDPOINT}/cortes/descuentos`;

  obtenerDescuentosPorOrdenId(ordenId: number): Observable<Descuento[]> {
    return this.httpClient.get<Descuento[]>(`${this.url}/orden/${ordenId}`);
  }

  crearDescuento(descuento: Descuento): Observable<Descuento> {
    return this.httpClient.post<Descuento>(`${this.url}`, descuento);
  }
}
