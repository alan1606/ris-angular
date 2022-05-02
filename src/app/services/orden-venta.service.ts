import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { OrdenVenta } from '../models/orden-venta';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class OrdenVentaService extends CommonService<OrdenVenta>{

  protected override baseEndpoint = BASE_ENDPOINT +  '/ris/ordenes-venta';

  constructor(http: HttpClient) { 
    super(http);
  }

  public actualizarOrdenVenta(orden: OrdenVenta): Observable<OrdenVenta>{
    return this.http.put<OrdenVenta>(`${this.baseEndpoint}/${orden.id}`, orden, { headers: this.cabeceras });
  }

}
