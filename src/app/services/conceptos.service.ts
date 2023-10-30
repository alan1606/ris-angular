import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { Concepto } from '../models/concepto';
import { CommonService } from './common.service';
import { Area } from '../models/area';

@Injectable({
  providedIn: 'root'
})
export class ConceptosService extends CommonService<Concepto> {

  protected override baseEndpoint = BASE_ENDPOINT +  '/ris/conceptos';

  constructor(http: HttpClient) { 
    super(http);
  }


  public override ver(id: number): Observable<Concepto> {
    return this.http.get<Concepto>(`${this.baseEndpoint}/${id}`);
  }

  public buscarLikeNombreEnArea(nombre: string, areaId: number): Observable<Concepto[]> {
    return this.http.get<Concepto[]>(`${this.baseEndpoint}/nombre/${nombre}/area/${areaId}`);
  }
  
  public buscarPorArea(area: Area): Observable<Concepto[]>{
    return this.http.get<Concepto[]>(`${this.baseEndpoint}/area/${area.id}`);
  }

}
