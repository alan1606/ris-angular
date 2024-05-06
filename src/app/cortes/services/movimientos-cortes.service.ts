import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_SITE } from 'src/app/config/app';
import { Movimiento } from 'src/app/models/movimiento';
@Injectable({
  providedIn: 'root',
})
export class MovimientosCortesService {
  constructor(private httpClient: HttpClient) {}

  buscarMovimientosCortePorCorteId(corteId: number): Observable<Movimiento[]> {
    return this.httpClient.get<Movimiento[]>(
      `${BASE_SITE}/cortes/movimientos-corte/corte/${corteId}`
    );
  }

  agregarMovimientoCorte(movimiento: Movimiento): Observable<Movimiento> {
    return this.httpClient.post<Movimiento>(
      `${BASE_SITE}/cortes/movimientos-corte`,
      movimiento
    );
  }
}
