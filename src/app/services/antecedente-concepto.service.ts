import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../config/app';
import { AntecedenteConcepto } from '../models/antecedente-concepto';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AntecedenteConceptoService extends CommonService<AntecedenteConcepto>{

  protected override baseEndpoint = BASE_ENDPOINT +  '/ris/antecedentes-conceptos';

  constructor(http: HttpClient) { 
    super(http);
  }
}
