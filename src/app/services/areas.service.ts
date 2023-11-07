import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { Area } from '../models/area';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AreasService extends CommonService<Area> {
  

  protected override baseEndpoint = BASE_ENDPOINT +  '/ris/areas';

  constructor(http: HttpClient) { 
    super(http);
  }

  public filtrarPorNombre(nombre: string): Observable<Area[]>{
    return this.http.get<Area[]>(`${this.baseEndpoint}/nombre/${nombre}`);
  }
}
