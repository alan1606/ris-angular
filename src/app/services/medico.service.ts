import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { Medico } from '../models/medico';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class MedicoService {
  private baseEndpoint = BASE_ENDPOINT + '/ris/medicos';
  private cabeceras: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  public filtrarRadiologosPorNombre(nombre: string): Observable<Medico[]> {
    return this.http.get<Medico[]>(
      `${this.baseEndpoint}/radiologos/nombre/${nombre}`
    );
  }

  public filtrarReferentesPorNombre(nombre: string): Observable<Medico[]> {
    return this.http.get<Medico[]>(
      `${this.baseEndpoint}/referentes/nombre/${nombre}`
    );
  }

  public encontrarRadiologoPorToken(token: string): Observable<Medico> {
    return this.http.get<Medico>(
      `${this.baseEndpoint}/radiologo/token/${token}`
    );
  }

  public encontrarMedicoPorTokenPorUsuario(
    usuario: string
  ): Observable<Medico> {
    return this.http.get<Medico>(
      `${this.baseEndpoint}/token/usuario/${usuario}`
    );
  }

  //Editar ya está en backend
  public editar(medico: Medico): Observable<Medico> {
    return this.http.put<Medico>(`${this.baseEndpoint}/${medico.id}`, medico, {
      headers: this.cabeceras,
    });
  }

  //crear referente ya está en el backend
  public crearMedicoReferente(medico: Medico): Observable<Medico> {
    return this.http.post<Medico>(`${this.baseEndpoint}/referentes`, medico, {
      headers: this.cabeceras,
    });
  }

  public crearMedicoReferentePurosNombre(medico: Medico): Observable<Medico> {
    return this.http.post<Medico>(
      `${this.baseEndpoint}/referentes-nombre`,
      medico,
      { headers: this.cabeceras }
    );
  }

  public encontrarMedicoReferentePorCorreo(correoElectronico: String): String {
    let correos: String[] = [
      'juan@gmail.com',
      'juan@gmail.com',
      'juan@gmail.com',
      'alan@gmail.com',
      'emmanuel@gmail.com',
    ];
    let busqueda = correos.includes(correoElectronico, 0);
    if (busqueda) {
      return correoElectronico;
    }
    return null;
  }
  public enviarCorreoVerificacion(correo: String): String {
    console.log(`Codigo enviado al correo ${correo}`);
    return 'Codigo enviado';
  }

  public verificarCodigo(codigo: String): String[] {
    let correos: String[] = [
      'juan@gmail.com',
      'juan@gmail.com',
      'juan@gmail.com',
      'alan@gmail.com',
      'emmanuel@gmail.com',
    ];
    if (codigo === '777') {
      return correos;
    }
    return null;
  }
}
