import { HttpClient, HttpParams } from '@angular/common/http';
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


  public buscarLikeNombre(nombre: string, page:string, size:string): Observable<any>{
    const params = new HttpParams()
    .set('page', page)
    .set('size', size);
    return this.http.get<any>(`${this.baseEndpoint}/person-name/${nombre}`, { params: params } );
  }

  public buscarUrlsJpg(iuid: string): Observable<string[]>{
    return this.http.get<string[]>(`${this.baseEndpoint}/iuid/${iuid}/images`);
  }
}
