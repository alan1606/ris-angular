import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { OrdenVenta } from '../models/orden-venta';
import { CommonService } from './common.service';
import { VentaConceptos } from '../models/venta-conceptos';

@Injectable({
  providedIn: 'root'
})
export class OrdenVentaService extends CommonService<OrdenVenta> {

  protected override baseEndpoint = BASE_ENDPOINT + '/ris/ordenes-venta';

  constructor(http: HttpClient) {
    super(http);
  }

  public actualizarOrdenVenta(orden: OrdenVenta): Observable<OrdenVenta> {
    return this.http.put<OrdenVenta>(`${this.baseEndpoint}/${orden.id}`, orden, { headers: this.cabeceras });
  }

  public venderConceptos(estudios: VentaConceptos[], orden: OrdenVenta) {
    const objetos = { estudios: estudios, orden: orden };
    console.log(objetos);
    return this.http.post<VentaConceptos[]>(`${this.baseEndpoint}/procesar`, JSON.stringify(objetos),
      { headers: this.cabeceras });
  }

  public venderConceptosSaludParral(estudios: VentaConceptos[], orden: OrdenVenta, folio: number) {
    const objetos = { estudios: estudios, orden: orden };
    console.log(objetos);
    return this.http.post<VentaConceptos[]>(`${this.baseEndpoint}/procesar/salud-parral/${folio}`, JSON.stringify(objetos),
      { headers: this.cabeceras });
  }

  public enviarInformacionSaludParral(idOrdenVenta: number): Observable<void> {
    return this.http.get<void>(`${this.baseEndpoint}/enviar-informacion-salud-parral/${idOrdenVenta}`);
  }

  public enviarInformacionPensiones(idOrdenVenta: number): Observable<void> {
    return this.http.get<void>(`${this.baseEndpoint}/enviar-informacion-pensiones/${idOrdenVenta}`);
  }

  public buscarOrdenVentaPorPacienteIdHoy(idPaciente: number): Observable<OrdenVenta[]> {
    return this.http.get<OrdenVenta[]>(`${this.baseEndpoint}/paciente/${idPaciente}/hoy`)
  }

  public pagar(orden: OrdenVenta, estudios: VentaConceptos[]): Observable<void> {
    const objetos = { estudios: estudios, orden: orden };
    return this.http.put<void>(`${this.baseEndpoint}/pagar/${orden.id}`, JSON.stringify(objetos), { headers: this.cabeceras });
  }

  public verSiExisteOrdenPorIdYPaciente(orden: number, paciente: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseEndpoint}/validar/${orden}/paciente/${paciente}`);
  }
}
