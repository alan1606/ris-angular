import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { Medico } from '../models/medico';

@Injectable({
  providedIn: 'root'
})
export class MedicoService { 
  private baseEndpoint = BASE_ENDPOINT +  '/ris/medicos';
  private cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {   }

  public filtrarRadiologosPorNombre(nombre: string): Observable<Medico[]>{
    return this.http.get<Medico[]>(`${this.baseEndpoint}/radiologos/nombre/${nombre}`);
  }

  public filtrarReferentesPorNombre(nombre: string): Observable<Medico[]>{
    return this.http.get<Medico[]>(`${this.baseEndpoint}/referentes/nombre/${nombre}`);
  }

  public encontrarRadiologoPorToken(token: string): Observable<Medico>{
    return this.http.get<Medico>((`${this.baseEndpoint}/radiologo/token/${token}`));
  }
  
  public encontrarMedicoPorTokenPorUsuario(usuario: string): Observable<Medico>{
    return this.http.get<Medico>(`${this.baseEndpoint}/token/usuario/${usuario}`);
  }

  public editar(medico: Medico): Observable<Medico>{
    return this.http.put<Medico>(`${this.baseEndpoint}/${medico.id}`, medico,
    { headers: this.cabeceras });
  }

  public crearMedicoReferente(medico: Medico): Observable<Medico>{
    return this.http.post<Medico>(`${this.baseEndpoint}/referentes`, medico,
    { headers: this.cabeceras });
  }

  public crearMedicoReferentePurosNombre(medico: Medico): Observable<Medico> {
    return this.http.post<Medico>(`${this.baseEndpoint}/referentes-nombre`, medico,
    { headers: this.cabeceras });
  }

}
