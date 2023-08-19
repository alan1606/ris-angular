import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { Observable } from 'rxjs';
import { ConceptoPrecio } from '../models/concepto';

@Injectable({
  providedIn: 'root'
})
export class PreciosService{

  private baseEndpoint: string = BASE_ENDPOINT + '/ris/precios';

  protected cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {}

  public buscarPorNombre(nombre:string, page: string, size: string): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.baseEndpoint}/nombre/${nombre}`, { params: params });
  }
  
  public buscarPorArea(areaId: number, page: string, size: string): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.baseEndpoint}/area/${areaId}`, { params: params });
  }


  public ver(conceptoPrecioId: number): Observable<ConceptoPrecio>{
    return this.http.get<ConceptoPrecio>(`${this.baseEndpoint}/${conceptoPrecioId}`);
  }

}
