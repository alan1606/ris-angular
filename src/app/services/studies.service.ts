import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { Study } from '../models/study';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class StudiesService extends CommonService<Study>{

  protected override baseEndpoint = BASE_ENDPOINT + '/pacs/studies';

  constructor(http: HttpClient) {
    super(http);
   }

   public buscarEstudiosPorApellidos(apellidos: string): Observable<Study[]>{
    return this.http.get<Study[]>(`${this.baseEndpoint}/person-name/${apellidos}`);
  }
}
