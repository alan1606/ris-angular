import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { Concepto } from '../models/concepto';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ConceptosService extends CommonService<Concepto> {

  protected override baseEndpoint = BASE_ENDPOINT +  '/ris/conceptos';

  constructor(http: HttpClient) { 
    super(http);
  }


}
