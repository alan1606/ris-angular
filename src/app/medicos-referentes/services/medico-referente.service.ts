import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { Medico } from 'src/app/models/medico';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { CommonService } from 'src/app/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class MedicoReferenteService {

  constructor(
    private http:HttpClient,
    ) {}
    protected baseEndpoint = BASE_ENDPOINT +  '/ris/instituciones';

  // obtenerMedicosReferentesNestjs():Observable<Medico[]>{
  //   return this.http.get<Medico[]>("http://localhost:3000/medicos-referentes")
  // }
  public buscarOrdenesPorMedicoYFechas(page:string, size:string , idInstitucion:number, fechaInicio:string , fechaFin:string):any{
    const params = new HttpParams()
    .set('page', page)
    .set('size', size);
    return this.http.get<OrdenVenta[]>(`${this.baseEndpoint}/${idInstitucion}/fechaInicio/${fechaInicio}/fechaFin/${fechaFin}`, { params: params });
  }
  public buscarMedicoReferentePorUsuario(usuario):Observable<any>{
    return this.http.get<any>(`${this.baseEndpoint}/usuario/${usuario}`);
  }


  public buscarOrdenesPorInstitucionYPaciente(page, size, idPaciente:number, idInstitucion:number):any{
    const params = new HttpParams()
    .set('page', page)
    .set('size', size);
    return this.http.get<OrdenVenta[]>(`${this.baseEndpoint}/${idInstitucion}/paciente/${idPaciente}`, { params: params });
  }
}
