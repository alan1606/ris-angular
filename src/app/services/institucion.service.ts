import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Institucion } from '../models/institucion';
import { BASE_ENDPOINT } from '../config/app';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrdenVenta } from '../models/orden-venta';
import { algo } from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class InstitucionService extends CommonService<Institucion>{

  protected override baseEndpoint = BASE_ENDPOINT +  '/ris/instituciones';
  

  constructor(http: HttpClient) { 
    super(http);
  }

  public buscarLikeNombre(nombre: string): Observable<Institucion[]> {
      return this.http.get<Institucion[]>(`${this.baseEndpoint}/nombre/${nombre}`);
  }
  public buscarPorPaciente(id:number, idInstitucion:number):Observable<OrdenVenta[]>{
    return this.http.get<OrdenVenta[]>(`${this.baseEndpoint}/${idInstitucion}/paciente/${id}`);
  }
  public buscarPorFecha(fechaInicio, fechaFin):Observable<OrdenVenta[]>{
    return this.http.get<OrdenVenta[]>("");
  }
  
}
