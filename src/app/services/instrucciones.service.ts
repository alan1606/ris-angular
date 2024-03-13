import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../config/app';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Instrucciones } from '../models/instrucciones';

@Injectable({
  providedIn: 'root'
})
export class InstruccionesService {

  private baseEndpoint = BASE_ENDPOINT +  '/ris/instrucciones';

  constructor(private http: HttpClient) {  }

  public buscarPorArea(areaId: number): Observable<Instrucciones>{
    return this.http.get<Instrucciones>(`${this.baseEndpoint}/area/${areaId}`);
  }
  
  public buscarPorInstitucion(institucionId: number): Observable<Instrucciones>{
    return this.http.get<Instrucciones>(`${this.baseEndpoint}/institucion/${institucionId}`);
  }

  public buscarPorConcepto(conceptoId: number): Observable<Instrucciones>{
    return this.http.get<Instrucciones>(`${this.baseEndpoint}/concepto/${conceptoId}`);
  }
}
