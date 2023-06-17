import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Campania } from '../models/campania';

@Injectable({
  providedIn: 'root'
})
export class CampaniaService {

  protected baseEndpoint: string;

  protected cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(protected http: HttpClient) { }

  public ver(id: number): Observable<Campania> {
    return this.http.get<Campania>(`${this.baseEndpoint}/${id}`);
  }

  public crear(campania: Campania): Observable<Campania> {
    return this.http.post<Campania>(this.baseEndpoint, campania,
      { headers: this.cabeceras });
  }

  public editar(entity: Campania): Observable<Campania> {
    return this.http.put<Campania>(`${this.baseEndpoint}/${entity.id}`, entity,
      { headers: this.cabeceras });
  }

  public eliminar(id: number): Observable<void>{
    return this.http.delete<void>(`${this.baseEndpoint}/${id}`);
  }

}
