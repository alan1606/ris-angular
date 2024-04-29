import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../config/app';
import { Observable } from 'rxjs';
import { VentaNoCerrada } from '../models/ventaNoCerrada';
@Injectable({
  providedIn: 'root',
})
export class VentasService {
  constructor(private http: HttpClient) {}

  public guardarVenta(venta: VentaNoCerrada): Observable<VentaNoCerrada> {
    console.log(venta);
    return this.http.post<VentaNoCerrada>(
      `${BASE_ENDPOINT}/ris/ventas`,
      venta
    );
  }
}
