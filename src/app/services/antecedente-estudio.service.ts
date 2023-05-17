import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { AntecedenteEstudio } from '../models/antecedente-estudio';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AntecedenteEstudioService extends CommonService<AntecedenteEstudio> {

  protected override baseEndpoint = BASE_ENDPOINT +  '/ris/antecedentes-estudios';

  constructor(http: HttpClient) { 
    super(http);
  }

  public filtrarPorVentaConceptosId(ventaConceptosId: number): Observable<AntecedenteEstudio[]>{
    return this.http.get<AntecedenteEstudio[]>(`${this.baseEndpoint}/venta-conceptos/${ventaConceptosId}`);
  }

  public crearTodos(antecedentes: AntecedenteEstudio[]): Observable<AntecedenteEstudio[]>{
    return this.http.post<AntecedenteEstudio[]>(`${this.baseEndpoint}/crear-todos`, antecedentes, 
                                                                      {headers: this.cabeceras});
  }

}
