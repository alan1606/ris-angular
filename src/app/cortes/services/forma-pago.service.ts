import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { FormaPago } from 'src/app/models/formaPago';

@Injectable({
  providedIn: 'root',
})
export class FormaPagoService {
  constructor(private httpClient: HttpClient) {}

  buscarFormasPago(): Observable<any> {
    return this.httpClient.get(`${BASE_ENDPOINT}/cortes/formas-pago`);
  }

  buscarFormaPagoPorId(id: number): Observable<any> {
    return this.httpClient.get(`${BASE_ENDPOINT}/cortes/formas-pago/${id}`);
  }

  agregarFormaPago(formaPago: FormaPago): Observable<any> {
    return this.httpClient.post(`${BASE_ENDPOINT}/cortes/formas-pago`, formaPago);
  }

  editarFormaPago(id: number, formaPago: any): Observable<any> {
    return this.httpClient.put(`${BASE_ENDPOINT}/cortes/formas-pago/${id}`, formaPago);
  }
}
