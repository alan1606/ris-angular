import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { ConceptoInstitucion } from '../models/concepto-institucion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConceptoInstitucionService {

  private baseEndpoint: string = BASE_ENDPOINT + '/ris/conceptos-institucion';

  protected cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {}

  public crear(conceptoInstitucion: ConceptoInstitucion): Observable<ConceptoInstitucion>{
    return this.http.post<ConceptoInstitucion>(this.baseEndpoint, conceptoInstitucion,
      { headers: this.cabeceras });
  }

  public buscar(concepto?: number, institucion?: number): Observable<ConceptoInstitucion[]> {
    let params = new HttpParams();
    
    if (concepto) {
      params = params.set('concepto', concepto);
    }
    if (institucion) {
      params = params.set('institucion', institucion);
    }

    return this.http.get<ConceptoInstitucion[]>(this.baseEndpoint, { params: params });
  }
}
