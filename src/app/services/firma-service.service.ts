import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'console';
import { Observable } from 'rxjs';
import { SERVER_FIRMAS_ADDRESS } from '../config/app';
@Injectable({
  providedIn: 'root',
})
export class FirmaService {
  constructor(private http: HttpClient) {}

  guardarFirma(id:number,firma:string): Observable<any> {
    return this.http.post(`${SERVER_FIRMAS_ADDRESS}/save`, { idPaciente:id,data: firma });
  }
}
