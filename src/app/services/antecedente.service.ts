import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { Antecedente } from '../models/antecedente';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AntecedenteService extends CommonService<Antecedente>{

  protected override baseEndpoint = BASE_ENDPOINT +  '/ris/antecedentes';

  constructor(http: HttpClient) { 
    super(http);
  }


  public encontrarPorConceptoId(conceptoId: number): Observable<Antecedente[]>{
      return this.http.get<Antecedente[]>(`${this.baseEndpoint}/concepto/${conceptoId}`);
  }
  
}
