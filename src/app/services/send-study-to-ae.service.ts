import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../config/app';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SendStudyToAeService {
  private baseEndpoint: string = BASE_ENDPOINT + "/pacs/send";

  private cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  public enviarEstudioAAe(uid: string, ae: string): Observable<String> {
    const url = `${this.baseEndpoint}/${uid}/ae/${ae}`;
    return this.http.post<String>(url, {}, { headers: this.cabeceras }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
