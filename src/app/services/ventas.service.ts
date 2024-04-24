import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../config/app';
@Injectable({
  providedIn: 'root',
})
export class VentasService {
  constructor(private http: HttpClient) {}

  health() {
    let respuesta = this.http.get(`${BASE_ENDPOINT}/ris/ventas/health`);
    console.log(respuesta);
  }
}
