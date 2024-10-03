import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Campania } from '../models/campania';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { CampaniaOrden } from '../models/campaniaOrden';
import { Persona } from '../models/persona';

@Injectable({
  providedIn: 'root'
})
export class CampaniaService {

  private baseEndpoint: string = BASE_ENDPOINT + '/campanias/campanias';;

  private cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  public ver(id: number): Observable<Campania> {
    return this.http.get<Campania>(`${this.baseEndpoint}/${id}`);
  }

  public crear(campania: Campania): Observable<Campania> {
    campania.conceptos.forEach(c => {
      c.instrucciones = null;
    }); //Hago esto porque si dejo las instrucciones el backend falla
    console.log(campania);
    return this.http.post<Campania>(this.baseEndpoint, campania,
      { headers: this.cabeceras });
  }

  public editar(entity: Campania): Observable<Campania> {
    return this.http.put<Campania>(`${this.baseEndpoint}/${entity.id}`, entity,
      { headers: this.cabeceras });
  }

  public eliminar(id: number): Observable<void>{
    return this.http.delete<void>(`${this.baseEndpoint}/${id}`);
  }


  public buscarTodo(page: string, size: string): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.baseEndpoint}`, { params: params });
  }


  public buscarPorNombre(nombre:string, page: string, size: string): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.baseEndpoint}/nombre/${nombre}`, { params: params });
  }

  public activas(page: string, size: string): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.baseEndpoint}/activas`, { params: params });
  }

  public inactivas(page: string, size: string): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.baseEndpoint}/inactivas`, { params: params });
  }

  public activasPorNombre(nombre: string, page: string, size: string): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.baseEndpoint}/activas/nombre/${nombre}`, { params: params });
  }

  public inactivasPorNombre(nombre:string, page: string, size: string): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.baseEndpoint}/inactivas/nombre/${nombre}`, { params: params });
  }

  public buscarPorCodigo(codigo: string): Observable<Campania>{
    console.log(codigo);
    return this.http.get<Campania>(`${this.baseEndpoint}/codigo/${codigo}`);
  }

  public registrarCampaniaOrden(campaniaOrden: CampaniaOrden): Observable<CampaniaOrden> {
    return this.http.post<CampaniaOrden>(`${this.baseEndpoint}/canjear`, campaniaOrden,
      { headers: this.cabeceras });
  }

  public obtenerCodigo(codigoBase: string, persona: Persona): Observable<void> {
    return this.http.post<void>(`${this.baseEndpoint}/codigo/${codigoBase}/clonar`, persona,
    { headers: this.cabeceras });
  }

  public mandarCampaniaWhatsapp(descripcion: string, landing: string, baja: string, lista: File){
    
    const formData = new FormData();
    formData.append('lista', lista);
    formData.append('descripcion', descripcion);
    formData.append('landing', landing);
    formData.append('baja', baja);

    return this.http.post<void>(`${this.baseEndpoint}/wp-mkt/enviar`,formData);
  }

  public desuscribir(persona: Persona): Observable<void> {
    return this.http.put<void>(`${this.baseEndpoint}/desuscribir`, persona,
    { headers: this.cabeceras });
  }

  obtenerCampaniasActivasPorConceptos(conceptos: number[]): Observable<Campania[]> {
    let params = new HttpParams();
    conceptos.forEach(concepto => {
      params = params.append('conceptos', concepto.toString());
    });

    return this.http.get<Campania[]>(`${this.baseEndpoint}/activas/conceptos`, { params });
  }
}
