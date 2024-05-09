import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT, BASE_SITE } from 'src/app/config/app';
import { Pago } from 'src/app/models/pago';
@Injectable({
  providedIn: 'root',
})
export class PagoOrdenService {
  constructor(private httpClient: HttpClient) {}

  url: string = `${BASE_ENDPOINT}/cortes/pagos-orden`;

  buscarPagosPorOrdenId(ordenId: number): Observable<Pago[]> {
    return this.httpClient.get<Pago[]>(`${this.url}/${ordenId}`);
  }

  crearPagosPorOrdenId(ordenId: number, pagos: Pago[]): Observable<Pago[]> {
    console.log(pagos);
    return this.httpClient.put<Pago[]>(`${this.url}/${ordenId}`, pagos);
  }
}