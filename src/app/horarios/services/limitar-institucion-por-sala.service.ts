import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { LimiteInstitucionSala } from 'src/app/models/LimiteInstitucionSala';

@Injectable({
  providedIn: 'root',
})
export class LimitarInstitucionPorSalaService {
  private url: string = BASE_ENDPOINT + '/ris/limites';
  constructor(private http: HttpClient) {}


  public encontrarLimitePorId(limiteId:number):Observable<LimiteInstitucionSala>{
    return this.http.get<LimiteInstitucionSala>(`${this.url}/${limiteId}`)
  }

  public crearLimite(limite:LimiteInstitucionSala):Observable<any>{
    return this.http.post(`${this.url}`,limite)
  }
  public encontrarLimitesPorSala(salaId: number): Observable<LimiteInstitucionSala[]> {
    return this.http.get<LimiteInstitucionSala[]>(`${this.url}/sala/${salaId}`);
  }

  public encontrarLimitesPorSalaInstitucion(salaId: number,institucionId: number): Observable<LimiteInstitucionSala> {
    return this.http.get<LimiteInstitucionSala>(`${this.url}/sala/${salaId}/institucion/${institucionId}`);
  }

  public eliminarLimitePorId(limiteId: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${limiteId}`);
  }
  public actualizarLimite(limiteId: number, limite:LimiteInstitucionSala): Observable<any> {
    return this.http.put<any>(`${this.url}/${limiteId}`,limite);
  }
}
