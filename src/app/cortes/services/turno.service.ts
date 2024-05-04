import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TurnoCorte } from 'src/app/models/turnoCorte';
import { BASE_ENDPOINT } from 'src/app/config/app';
@Injectable({
  providedIn: 'root',
})
export class TurnoService {
  constructor(private httpClient: HttpClient) {}

  verTurnos(): Observable<TurnoCorte[]> {
    return this.httpClient.get<TurnoCorte[]>(
      `${BASE_ENDPOINT}/cortes/turnos-cortes`
    );
  }
  buscarTurnoPorId(id: number) {
    return this.httpClient.get<TurnoCorte>(
      `${BASE_ENDPOINT}/cortes/turnos-cortes/${id}`
    );
  }

  guardarTurno(turno: TurnoCorte): Observable<TurnoCorte> {
    console.log(turno);
    return this.httpClient.post<TurnoCorte>(
      `${BASE_ENDPOINT}/cortes/turnos-cortes`,
      turno
    );
  }

  editarTurno(id: number, turno: TurnoCorte): Observable<TurnoCorte> {
    return this.httpClient.put<TurnoCorte>(
      `${BASE_ENDPOINT}/cortes/turnos-cortes/${id}`,
      turno
    );
  }
}
