import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Institucion } from '../models/institucion';
import { BASE_ENDPOINT } from '../config/app';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrdenVenta } from '../models/orden-venta';
import { algo } from 'crypto-js';
import { Medico } from '../models/medico';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

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

  public buscarOrdenesPorInstitucionYPaciente(page, size, idPaciente:number, idInstitucion:number):any{
    const params = new HttpParams()
    .set('page', page)
    .set('size', size);
    return this.http.get<OrdenVenta[]>(`${this.baseEndpoint}/${idInstitucion}/paciente/${idPaciente}`, { params: params });
  }

  public buscarOrdenesPorInstitucionYFechas(page:string, size:string , idInstitucion:number, fechaInicio:string , fechaFin:string ):any{
    const params = new HttpParams()
    .set('page', page)
    .set('size', size);
    return this.http.get<OrdenVenta[]>(`${this.baseEndpoint}/${idInstitucion}/fechaInicio/${fechaInicio}/fechaFin/${fechaFin}`, { params: params });
  }
  
  public buscarInstitucionPorUsuario(usuario: string): Observable<Institucion>{
    return this.http.get<Institucion>(`${this.baseEndpoint}/usuario/${usuario}`);
  }

  public editarMedico(id:number,medico):string{
    // return this.http.put<Medico>(`/${this.baseEndpoint}/algo/${id}`, medico)
    return "editado"

  }
  public crearMedico(medico){
    // return this.http.post<Medico>(`${this.baseEndpoint}/algo`,medico)
    return"creado"
  }
}
