import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { AreaTotal } from '../models/area-total';
import { EstudioHora } from '../models/estudio-hora';
import { OrdenVenta } from '../models/orden-venta';
import { VentaConceptos } from '../models/venta-conceptos';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class VentaConceptosService extends CommonService<VentaConceptos>{

  protected override baseEndpoint = BASE_ENDPOINT +  '/ris/venta-conceptos';

  constructor(http: HttpClient) { 
    super(http);
  }

  public buscarEnPacs(id: number): Observable<void>{
    return this.http.get<void>(`${this.baseEndpoint}/buscar-iuid-en-pacs/${id}`);
  }

  public filtrarDiaDeHoy(): Observable<VentaConceptos[]>{
    return this.http.get<VentaConceptos[]>(`${this.baseEndpoint}/hoy`);
  }

  public filtrarRango(fechaInicio: string, fechaFin: string): Observable<VentaConceptos[]>{
    return this.http.get<VentaConceptos[]>(`${this.baseEndpoint}/desde/${fechaInicio}/hasta/${fechaFin}`);
  }

  public filtrarRangoYConcepto(fechaInicio: string, fechaFin: string, idConcepto: number): Observable<VentaConceptos[]>{
    return this.http.get<VentaConceptos[]>(`${this.baseEndpoint}/desde/${fechaInicio}/hasta/${fechaFin}/concepto/${idConcepto}`);
  }

  public filtrarRangoYArea(fechaInicio: string, fechaFin: string, idArea: number): Observable<VentaConceptos[]>{
    return this.http.get<VentaConceptos[]>(`${this.baseEndpoint}/desde/${fechaInicio}/hasta/${fechaFin}/area/${idArea}`);
  }

  public filtrarRangoYPaciente(fechaInicio: string, fechaFin: string, idPaciente: number): Observable<VentaConceptos[]>{
    return this.http.get<VentaConceptos[]>(`${this.baseEndpoint}/desde/${fechaInicio}/hasta/${fechaFin}/paciente/${idPaciente}`);
  }

  public encontrarTotalesAgendadosPorAreaFecha(fecha: String): Observable<AreaTotal[]>{
    return this.http.get<AreaTotal[]>(`${this.baseEndpoint}/totales-agendados-por-area-fecha/${fecha}`);
  }

  public encontrarEstudiosAgendadosPorAreaFecha(areaId: number, fecha: string): Observable<EstudioHora[]>{
    return this.http.get<EstudioHora[]>(`${this.baseEndpoint}/agendados-por-area-fecha/${areaId}/${fecha}`);
  }

}
