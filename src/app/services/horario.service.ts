import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../config/app';
import { Horario } from '../models/horario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private baseEndpoint: string = BASE_ENDPOINT +  '/citas/horarios';

  private cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  public crear(horario: Horario): Observable<Horario> {
    return this.http.post<Horario>(this.baseEndpoint, horario,
      { headers: this.cabeceras });
  }

  public ver(id: number): Observable<Horario> {
    return this.http.get<Horario>(`${this.baseEndpoint}/${id}`);
  }

  public editar(horario: Horario): Observable<Horario> {
    return this.http.put<Horario>(`${this.baseEndpoint}/${horario.id}`, horario,
      { headers: this.cabeceras });
  }

  public filtrarPorSalaId(salaId: number): Observable<Horario[]>{
    return this.http.get<Horario[]>(`${this.baseEndpoint}/sala/${salaId}`);
  }

  public marcarDiaInhabil(fechaInicio: string, fechaFin: string): Observable<void> {
    return this.http.put<void>(`${this.baseEndpoint}/inhabil/${fechaInicio}/${fechaFin}`,{});
  }
  public marcarDiaInhabilEnSala(fechaInicio: string, fechaFin: string, salaId: number): Observable<void> {
    return this.http.put<void>(`${this.baseEndpoint}/inhabil/${fechaInicio}/${fechaFin}/sala/${salaId}`,{});
  }

  public marcarDiaInhabilHoras(fechaInicio: string, fechaFin: string, horaInicio: string, horaFin: string): Observable<void> {
    return this.http.put<void>(`${this.baseEndpoint}/inhabil/${fechaInicio}/${fechaFin}/horas/${horaInicio}/${horaFin}`,{});
  }
  public marcarDiaInhabilEnSalaHoras(fechaInicio: string, fechaFin: string, salaId: number, horaInicio: string, horaFin: string): Observable<void> {
    return this.http.put<void>(`${this.baseEndpoint}/inhabil/${fechaInicio}/${fechaFin}/sala/${salaId}/horas/${horaInicio}/${horaFin}`,{});
  }

}
