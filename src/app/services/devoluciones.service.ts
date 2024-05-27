import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { OrdenVenta } from '../models/orden-venta';

@Injectable({
  providedIn: 'root',
})
export class DevolucionesService {
  private url = BASE_ENDPOINT + '/ris/ordenes-venta';
  constructor(private http: HttpClient) {}

  buscarOrdenesParaDevolucion(fecha: string): Observable<OrdenVenta[]> {
    return this.http.get<OrdenVenta[]>(`${this.url}/${fecha}/devolucion`);
  }
}
