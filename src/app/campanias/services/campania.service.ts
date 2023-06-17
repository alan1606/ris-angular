import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Campania } from '../models/campania';
import { BASE_ENDPOINT } from 'src/app/config/app';

@Injectable({
  providedIn: 'root'
})
export class CampaniaService {

  private baseEndpoint: string = BASE_ENDPOINT + '/campanias/campanias';;

  private cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

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


  public buscarTodo(page: string, size: string): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.baseEndpoint}`, { params: params });
  }


}
