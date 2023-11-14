import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../config/app';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private baseEndpoint: string = BASE_ENDPOINT +  '/citas';

  private cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  public generar(fechaInicio: string, fechaFin: string): Observable<void> {
    return this.http.post<void>(`${this.baseEndpoint}/generar`, {fechaInicio, fechaFin},
      { headers: this.cabeceras });
  }

}
