import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT, BASE_SITE } from 'src/app/config/app';

@Injectable({
  providedIn: 'root',
})
export class CorteService {
  constructor(private httpClient: HttpClient) {}

  private url: string = `${BASE_ENDPOINT}/cortes`;

  obtenerCorte(fecha: string, turno: string): Observable<any> {
    return this.httpClient.get(`${this.url}/fecha/${fecha}/turno/${turno}`, { responseType: 'blob' });
  }

  obtenerCorteActual(): Observable<any> {
    return this.httpClient.get(`${this.url}/actual`);
  }
}
