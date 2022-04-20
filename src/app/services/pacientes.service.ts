import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paciente } from '../models/paciente';
import { CommonService } from './common.service';
import { BASE_ENDPOINT } from '../config/app';

@Injectable({
  providedIn: 'root'
})
export class PacientesService extends CommonService<Paciente>{


  protected override baseEndpoint = BASE_ENDPOINT + '/ris/pacientes';


  constructor(http: HttpClient) {
    super(http);
   }
}
