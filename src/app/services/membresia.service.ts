import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../config/app';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Membresia } from '../models/membresia';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembresiaService {
  private baseEndpoint = BASE_ENDPOINT +  '/ris/membresias';
  private cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  public crear(membresia: Membresia): Observable<Membresia>{
    return this.http.post<Membresia>(`${this.baseEndpoint}`, membresia,
    { headers: this.cabeceras });
  }
}
