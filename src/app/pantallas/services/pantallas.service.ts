import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { DicomRoom } from '../models/DicomRoom';

@Injectable({
  providedIn: 'root',
})
export class PantallasService {
  private http = inject(HttpClient);
  private url = BASE_ENDPOINT + '/turnero';
  constructor() {}

  public findAllEnabled = (): Observable<any> => {
    return this.http.get<any>(`${this.url}/salas`);
  };

  public addRoomToScreens(sala: DicomRoom): Observable<any> {
    return this.http.put<any>(`${this.url}/salas`, sala);
  }
}
