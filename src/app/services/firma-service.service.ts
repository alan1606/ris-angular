import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'console';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirmaService {
  constructor(private http: HttpClient) {}

  ping() {
    this.http.get('http://localhost:3000/firmas').subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  guardarFirma(firma): void {
    this.http
      .post(`http://localhost:3000/firmas/save`, { data: firma })
      .subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
