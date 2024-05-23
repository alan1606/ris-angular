import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
@Injectable({
  providedIn: 'root',
})
export class FirmaService {
  constructor(private http: HttpClient) {}

  guardarFirma(firma): Observable<any> {
    return this.http.post(`${BASE_ENDPOINT}/ris/firmas`, firma);
  }
}
