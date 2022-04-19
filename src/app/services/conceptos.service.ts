import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Concepto } from '../models/concepto';

@Injectable({
  providedIn: 'root'
})
export class ConceptosService {

  private baseEndpoint = 'http://localhost:8090/api/ris/conceptos';

  private cabeceras: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  public listar(): Observable<Concepto[]> {
    return this.http.get<Concepto[]>(this.baseEndpoint)
  }

  public listarPaginas(page: string, size: string): Observable<any>{
    const params = new HttpParams()
    .set('page', page)
    .set('size', size);

    return this.http.get<any>(`${this.baseEndpoint}/pagina`, {params: params});
  }

  public ver(id: number): Observable<Concepto> {
    return this.http.get<Concepto>(`${this.baseEndpoint}/${id}`);
  }

  public crear(concepto: Concepto): Observable<Concepto> {
    return this.http.post<Concepto>(this.baseEndpoint, concepto,
      { headers: this.cabeceras });
  }

  public editar(concepto: Concepto): Observable<Concepto> {
    return this.http.put<Concepto>(`${this.baseEndpoint}/${concepto.id}`, concepto,
      { headers: this.cabeceras });
  }

  public eliminar(id: number): Observable<void>{
    return this.http.delete<void>(`${this.baseEndpoint}/${id}`);
  }

}
