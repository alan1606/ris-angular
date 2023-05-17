import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT, VIEWER } from '../config/app';
import { VentaConceptos } from '../models/venta-conceptos';

@Injectable({
  providedIn: 'root'
})
export class SendMailService {

  private baseEndpoint =  BASE_ENDPOINT + '/ris/enviar-correo';

  constructor(private http: HttpClient) { 
    
  }

  public enviarCorreoInterpretar(estudio: VentaConceptos): Observable<void>{
    return this.http.get<void>(`${this.baseEndpoint}/venta-concepto/interpretar/${estudio.id}`);
  }

  public enviarCorreoResultados(estudio: VentaConceptos): Observable<void>{
    return this.http.get<void>(`${this.baseEndpoint}/venta-concepto/resultados/${estudio.id}`);
  }

  public enviarAvisoInterpretacionHecha(estudio: VentaConceptos): Observable<void>{
    return this.http.get<void>(`${this.baseEndpoint}/aviso-interpretado/${estudio.id}`);
  }
}
