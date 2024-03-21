import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { Medico } from 'src/app/models/medico';
import { OrdenVenta } from 'src/app/models/orden-venta';


@Injectable({
  providedIn: 'root'
})
export class MedicoReferenteService {

  constructor(
    private http:HttpClient,
    ) {}
    protected baseEndpoint = BASE_ENDPOINT +  '/ris/instituciones';

  public buscarOrdenesPorMedicoYFechas(page:string, size:string , idInstitucion:number, fechaInicio:string , fechaFin:string):any{
    const params = new HttpParams()
    .set('page', page)
    .set('size', size);
    return this.http.get<OrdenVenta[]>(`${this.baseEndpoint}/${idInstitucion}/fechaInicio/${fechaInicio}/fechaFin/${fechaFin}`, { params: params });
  }

  public buscarMedicoReferentePorUsuario(usuario):Observable<any>{
    return this.http.get<any>(`${this.baseEndpoint}/usuario/${usuario}`);
  }

  public buscarOrdenesPorMedicoYPaciente(page, size, idPaciente:number, idMedico:number):any{
    const params = new HttpParams()
    .set('page', page)
    .set('size', size);
    return this.http.get<OrdenVenta[]>(`${this.baseEndpoint}/${idMedico}/paciente/${idPaciente}`, { params: params });
  }


  public encontrarPorUsuario(usuario: string): Observable<Medico> {
    return this.http.get<Medico>(`${this.baseEndpoint}/usuario/${usuario}`);
  }
}
