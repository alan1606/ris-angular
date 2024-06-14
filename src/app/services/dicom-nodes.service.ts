import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../config/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DicomNodesService {

  private baseEndpoint: string = BASE_ENDPOINT + "/pacs/dicom-nodes";

  //private cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  public buscarNodos(): Observable<string[]>{
    return this.http.get<string[]>(`${this.baseEndpoint}`);
  }
}
