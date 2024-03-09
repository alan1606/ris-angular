import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../config/app';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InstruccionesService {

  private baseEndpoint = BASE_ENDPOINT +  '/ris/instrucciones';

  constructor(private http: HttpClient) {  }

  
}
