import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../../config/app';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CodigoComprobacion } from '../../models/codigo-comprobacion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodigosMedicosReferentesService {
  private baseEndpoint = BASE_ENDPOINT +  '/medicos-referentes/codigo-comprobacion';
  private cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {   }


  public mandarCodigoComprobacion(codigoComprobacion: CodigoComprobacion): Observable<void>{
    return this.http.post<void>(`${this.baseEndpoint}`, codigoComprobacion,
    { headers: this.cabeceras });
  }


  
  public verificarCodigoComprobacion(codigoComprobacion: CodigoComprobacion): Observable<boolean>{
    return this.http.post<boolean>(`${this.baseEndpoint}/validar`, codigoComprobacion,
    { headers: this.cabeceras });
  }


}
