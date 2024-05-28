import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { Movimiento } from 'src/app/models/movimiento';
import { OrdenVenta } from 'src/app/models/orden-venta';
@Injectable({
  providedIn: 'root',
})
export class MovimientosCortesService {
  constructor(private httpClient: HttpClient) {}

  buscarMovimientosCortePorCorteId(corteId: number): Observable<Movimiento[]> {
    return this.httpClient.get<Movimiento[]>(
      `${BASE_ENDPOINT}/cortes/movimientos/corte/${corteId}`
    );
  }

  agregarMovimientoCorte(
    fecha,
    movimiento: Movimiento
  ): Observable<Movimiento> {
    return this.httpClient.post<Movimiento>(
      `${BASE_ENDPOINT}/cortes/movimientos/${movimiento.tipo}/${fecha}`,
      movimiento
    );
  }

  crearDevolucion(orden: OrdenVenta): Observable<any> {
    return this.httpClient.post(
      `${BASE_ENDPOINT}/cortes/movimientos/devolucion`,
      orden
    );
  }
}
