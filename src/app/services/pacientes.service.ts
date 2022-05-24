import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paciente } from '../models/paciente';
import { CommonService } from './common.service';
import { BASE_ENDPOINT } from '../config/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacientesService extends CommonService<Paciente>{


  protected override baseEndpoint = BASE_ENDPOINT + '/ris/pacientes';

  constructor(http: HttpClient) {
    super(http);
   }

   public override crear(paciente: Paciente): Observable<Paciente> {
     paciente.nombreCompleto = `${paciente.nombre} ${paciente.apellidoPaterno} ${paciente.apellidoMaterno}`;
    return super.crear(paciente);
  }

  public filtrarPorNombre(nombre: string, ): Observable<Paciente[]>{
    return this.http.get<Paciente[]>(`${this.baseEndpoint}/nombre/${nombre}`);
  }
 
  public filtrarPorNombreYRadiologoId(nombre: string, idMedicoRadiologo: number): Observable<Paciente[]>{
    return this.http.get<Paciente[]>(`${this.baseEndpoint}/nombre/${nombre}/medico-radiologo/${idMedicoRadiologo}`);
  }
}
