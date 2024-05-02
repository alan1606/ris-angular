import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from 'src/app/config/app';

@Injectable({
  providedIn: 'root',
})
export class FormaPagoService {
  constructor(private httpClient: HttpClient) {}

  buscarFormasPago(): Observable<any> {
    return this.httpClient.get(`${BASE_ENDPOINT}/formas-pago`);
  }

  buscarFormaPagoPorId(id: number): Observable<any> {
    return this.httpClient.get(`${BASE_ENDPOINT}/formas-pago/${id}`);
  }

  agregarFormaPago(formaPago: any): Observable<any> {
    return this.httpClient.post(`${BASE_ENDPOINT}/formas-pago`, formaPago);
  }

  editarFormaPago(id: number, formaPago: any): Observable<any> {
    return this.httpClient.put(`${BASE_ENDPOINT}/formas-pago/${id}`, formaPago);
  }
}
