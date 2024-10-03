import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT, FILES_PATH } from '../config/app';
import { Multimedia } from '../models/multimedia';
import { CommonService } from './common.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MultimediaService extends CommonService<Multimedia> {
  protected override baseEndpoint = BASE_ENDPOINT + '/ris/multimedia';

  constructor(http: HttpClient) {
    super(http);
  }

  public subirPdf(multimedia: Multimedia, pdf: File): Observable<Multimedia> {
    const formData = new FormData();
    formData.append('documento', pdf);
    return this.http.post<Multimedia>(
      this.baseEndpoint + '/documento/orden-venta/' + multimedia.ordenVenta.id,
      formData
    );
  }

  public subirImagen(
    multimedia: Multimedia,
    imagen: File
  ): Observable<Multimedia> {
    const formData = new FormData();
    formData.append('imagen', imagen);
    return this.http.post<Multimedia>(
      this.baseEndpoint + '/imagen/orden-venta/' + multimedia.ordenVenta.id,
      formData
    );
  }

  public buscarPorOrdenVentaId(id: number): Observable<Multimedia[]> {
    return this.http.get<Multimedia[]>(
      `${this.baseEndpoint}/orden-venta/${id}`
    );
  }

  public buscarPorVentaConceptoId(id: number): Observable<Multimedia[]> {
    return this.http.get<Multimedia[]>(
      `${this.baseEndpoint}/venta-conceptos/${id}`
    );
  }

  public verDocumento(multimedia: Multimedia) {
    return this.http
      .get(`${FILES_PATH}/${multimedia.ruta}`, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        })
      );
  }

  public subirInterpretacionPdf(
    multimedia: Multimedia,
    pdf: File
  ): Observable<Multimedia> {
    const formData = new FormData();
    formData.append('documento', pdf);
    return this.http.post<Multimedia>(
      this.baseEndpoint +
        '/interpretacion/orden-venta/' +
        multimedia.ordenVenta.id,
      formData
    );
  }

  public downloadSign(nombreArchivo: string): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/octet-stream', // Indicamos que esperamos un archivo binario
    });
    return this.http.get(`${this.baseEndpoint}/archivo/${nombreArchivo}`, {
      headers,
      responseType: 'blob',
    });
  }
}
