import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { Tecnico } from '../models/tecnico';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class TecnicoService extends CommonService<Tecnico>{
  
  protected override baseEndpoint = BASE_ENDPOINT +  '/ris/tecnicos';

  constructor(http: HttpClient) { 
    super(http);
  }

  public filtrarPorNombre(nombre: string): Observable<Tecnico[]>{
    return this.http.get<Tecnico[]>(`${this.baseEndpoint}/nombre/${nombre}`);
  }

}
