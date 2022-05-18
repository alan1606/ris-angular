import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paciente } from '../models/paciente';
import { CommonService } from './common.service';
import { BASE_ENDPOINT } from '../config/app';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PacientesService extends CommonService<Paciente>{


  protected override baseEndpoint = BASE_ENDPOINT + '/ris/pacientes';

  constructor(http: HttpClient, private router: Router) {
    super(http);
   }

   private isNoAutorizado(e): boolean{
      if(e){
        this.router.navigate(['/login']);
        console.log("redirigir al login");
        return true;
      }
      return false;
   }


  public filtrarPorNombre(nombre: string): Observable<Paciente[]>{
    return this.http.get<Paciente[]>(`${this.baseEndpoint}/nombre/${nombre}`).pipe(
      catchError(e =>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  public override listar(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.baseEndpoint).pipe(
      catchError(e =>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  public override listarPaginas(page: string, size: string): Observable<any>{
    const params = new HttpParams()
    .set('page', page)
    .set('size', size);

    return this.http.get<any>(`${this.baseEndpoint}/pagina`, {params: params}).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  public override ver(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.baseEndpoint}/${id}`).pipe(
      catchError(e =>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }


  public override crear(paciente: Paciente): Observable<Paciente> {
    paciente.nombreCompleto = `${paciente.nombre} ${paciente.apellidoPaterno} ${paciente.apellidoMaterno}`;
    return this.http.post<Paciente>(this.baseEndpoint, paciente,
      { headers: this.cabeceras }).pipe(
        catchError(e =>{
          this.isNoAutorizado(e);
          return throwError(e);
        })
      );
 }

  public override editar(entity: Paciente): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.baseEndpoint}/${entity.id}`, entity,
      { headers: this.cabeceras }).pipe(
        catchError(e =>{
          this.isNoAutorizado(e);
          return throwError(e);
        })
      );
  }

  public override eliminar(id: number): Observable<void>{
    return this.http.delete<void>(`${this.baseEndpoint}/${id}`).pipe(
      catchError(e =>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

}
