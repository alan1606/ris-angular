import { Injectable } from '@angular/core';
import { WORKLIST_ENDPOINT } from '../config/app';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorklistService {
  private  baseEndpoint = WORKLIST_ENDPOINT;

  constructor(private http: HttpClient) { }

  public procesarEstudio(idVentaConcepto: number): Observable<void> {
    const headers = new HttpHeaders({ Authorization: 'Basic ' + btoa('admin' + ':' + 'O9CavZ$cYSlKbk1^m%Q!t8OpaIg5hAIT$fjJR4Hh6VJYVr9xCZ') });
    return this.http.get<void>(`${this.baseEndpoint}/${idVentaConcepto}`, { headers });
  }
}
