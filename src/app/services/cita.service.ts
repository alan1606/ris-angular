import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../config/app';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita } from '../models/cita';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  
  private baseEndpoint: string = BASE_ENDPOINT +  '/citas';

  private cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  public generar(fechaInicio: string, fechaFin: string): Observable<void> {
    return this.http.post<void>(`${this.baseEndpoint}/generar`, {fechaInicio, fechaFin},
      { headers: this.cabeceras });
  }

  public generarPorSala(salaId:number, fechaInicio: string, fechaFin: string): Observable<void> {
    return this.http.post<void>(`${this.baseEndpoint}/generar`, {fechaInicio, fechaFin, salaId},
      { headers: this.cabeceras });
  }

  public obtenerDisponiblesPorSalaYFechaEspacios(salaId: number, fecha: string, espacios: number): Observable<Cita[]>{
    return this.http.get<Cita[]>(`${this.baseEndpoint}/disponibles/sala/${salaId}/dia/${fecha}/espacios/${espacios}`);
  }

  public apartarCita(citaId: number): Observable<void>{
    return this.http.put<void>(`${this.baseEndpoint}/apartar/${citaId}`, {});
  }

  
  public apartarCitaEspacios(citaId: number, espacios: number): Observable<Cita[]>{
    console.log(citaId, espacios);
    return this.http.put<Cita[]>(`${this.baseEndpoint}/apartar/${citaId}/espacios/${espacios}`, {});
  }

  public liberarCita(citaId: number): Observable<void> {
    return this.http.put<void>(`${this.baseEndpoint}/liberar/${citaId}`, {});
  }
  public confirmarCitas(idsVentaConceptos: number[]): Observable<void>{
    return this.http.put<void>(`${this.baseEndpoint}/confirmar`, idsVentaConceptos)
  }

  public mandarConfirmacionesDiaSiguiente(): Observable<void>{
    return this.http.post<void>(`${this.baseEndpoint}/mandar-confirmaciones-dia-siguiente`, {});
  }

  public mandarConfirmacionesPorFecha(fecha:string):Observable<void>{
    return this.http.post<void>(`${this.baseEndpoint}/mandar-confirmaciones/${fecha}`,{})
  }

  public buscarPorFecha(fecha: string, page: string, size: string): Observable<any>{
    const params = new HttpParams()
    .set('page', page)
    .set('size', size);

    return this.http.get<any>(`${this.baseEndpoint}/fecha/${fecha}`, {params: params});
  }

  public cancelarCita(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseEndpoint}/cancelar/${id}`, {});
  }

  public reagendar(citaOrigenId: number, citaDestinoId: number, cita: Cita, espacios:number): Observable<Cita> {
    //retorna la nueva cita
    console.log(cita);
    return this.http.put<Cita>(`${this.baseEndpoint}/reagendar/origen/${citaOrigenId}/destino/${citaDestinoId}/espacios/${espacios}`, cita,
    { headers: this.cabeceras });
  }

  public citasDeHoy(): Observable<Cita[]>{
    return this.http.get<any>(`${this.baseEndpoint}/hoy`);
  }

  public obtenerCitasDelLimbo(idSala:number, fecha:string):Observable<Cita[]>{
    return this.http.get<Cita[]>(`${this.baseEndpoint}/limbo/sala/${idSala}/fecha/${fecha}`);  
  }

  public salvameDelHastio(idCita:number):Observable<Cita>{
    return this.http.put<Cita>(`${this.baseEndpoint}/salvame-del-hastio/${idCita}`,{})
  }

  public citaNoContestada(citaId:number):Observable<void>{
    return this.http.put<void>(`${this.baseEndpoint}/no-contestado/${citaId}`,{})
  }
}
