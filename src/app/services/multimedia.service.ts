import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { Multimedia } from '../models/multimedia';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class MultimediaService extends CommonService<Multimedia>{

  protected override baseEndpoint = BASE_ENDPOINT +  '/ris/multimedia';

  constructor(http: HttpClient) { 
    super(http);
  }

  public subirPdf(multimedia: Multimedia, pdf: File): Observable<Multimedia>{
    const formData = new FormData();
    formData.append('documento', pdf);
    return this.http.post<Multimedia>(this.baseEndpoint +  '/documento/orden-venta/' + multimedia.ordenVenta.id, formData);
  }

  public subirImagen(multimedia: Multimedia, imagen: File): Observable<Multimedia>{
    const formData = new FormData();
    formData.append('imagen', imagen);
    return this.http.post<Multimedia>(this.baseEndpoint +  '/imagen/orden-venta/' + multimedia.ordenVenta.id, formData);
  }

  public buscarPorOrdenVentaId(id: number): Observable<Multimedia[]>{
    return this.http.get<Multimedia[]>(`${this.baseEndpoint}/orden-venta/${id}`);
  }
}
