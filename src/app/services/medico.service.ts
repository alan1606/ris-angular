import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { Medico } from '../models/medico';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class MedicoService extends CommonService<Medico>{
  
  protected override baseEndpoint = BASE_ENDPOINT +  '/ris/medicos';

  constructor(http: HttpClient) { 
    super(http);
  }

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

}
