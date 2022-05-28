import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { Interpretacion } from '../models/interpretacion';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class InterpretacionService extends CommonService<Interpretacion>{

  protected override baseEndpoint = BASE_ENDPOINT +  '/ris/interpretaciones';

  constructor(http: HttpClient) { 
    super(http);
  }

  public encontrarPorEstudioId(estudioId: number): Observable<Interpretacion[]>{
    return this.http.get<Interpretacion[]>(`${this.baseEndpoint}/estudio/${estudioId}`);
  }
}
