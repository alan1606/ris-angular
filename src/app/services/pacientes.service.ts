import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paciente } from '../models/paciente';
import { CommonService } from './common.service';
import { BASE_ENDPOINT } from '../config/app';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PacientesService extends CommonService<Paciente>{


  protected override baseEndpoint = BASE_ENDPOINT + '/ris/pacientes';

  constructor(http: HttpClient, private router: Router) {
    super(http);
   }


  public filtrarPorNombre(nombre: string, ): Observable<Paciente[]>{
    return this.http.get<Paciente[]>(`${this.baseEndpoint}/nombre/${nombre}`);

  }

  public filtrarPorNombreYRadiologoId(nombre: string, idMedicoRadiologo: number): Observable<Paciente[]>{
    return this.http.get<Paciente[]>(`${this.baseEndpoint}/nombre/${nombre}/medico-radiologo/${idMedicoRadiologo}`);
  }
   buscarPacienteConOrdenVentaHoy(nombre:string){
    return [{},{}]

  }
}
