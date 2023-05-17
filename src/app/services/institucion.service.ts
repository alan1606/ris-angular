import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Institucion } from '../models/institucion';
import { BASE_ENDPOINT } from '../config/app';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstitucionService extends CommonService<Institucion>{

  protected override baseEndpoint = BASE_ENDPOINT +  '/ris/instituciones';

  constructor(http: HttpClient) { 
    super(http);
  }

  public buscarLikeNombre(nombre: string): Observable<Institucion[]> {
      return this.http.get<Institucion[]>(`${this.baseEndpoint}/nombre/${nombre}`)
  }
}
