import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { Medico } from '../models/medico';
import { OrdenVenta } from '../models/orden-venta';
import { AlertaService } from '../shared/services/alerta.service';

@Injectable({
  providedIn: 'root',
})
export class MedicoService {
 
  private baseEndpoint = BASE_ENDPOINT + '/ris/medicos';
  private cabeceras: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient, private alertaService: AlertaService) {}

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

  public filtrarReferentesPorCorreo(correo: string): Observable<Medico> {
    return this.http.get<Medico>(
      `${this.baseEndpoint}/referentes/correo/${correo}`
    );
  }

  public filtrarReferentesPorWhatsapp(whatsapp: string): Observable<Medico> {
    return this.http.get<Medico>(
      `${this.baseEndpoint}/referentes/whatsapp/${whatsapp}`
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

  public editar(medico: Medico): Observable<Medico> {
    return this.http.put<Medico>(`${this.baseEndpoint}/${medico.id}`, medico, {
      headers: this.cabeceras,
    });
  }

  public crearMedicoReferente(medico: Medico): Observable<Medico> {
    return this.http.post<Medico>(`${this.baseEndpoint}/referentes`, medico, {
      headers: this.cabeceras,
    });
  }

  public crearMedicoReferenteAutorregistro(medico: Medico): Observable<Medico> {
    return this.http.post<Medico>(
      `${this.baseEndpoint}/referentes/autorregistro`,
      medico,
      { headers: this.cabeceras }
    );
  }

  public crearMedicoReferentePurosNombre(medico: Medico): Observable<Medico> {
    return this.http.post<Medico>(
      `${this.baseEndpoint}/referentes-nombre`,
      medico,
      { headers: this.cabeceras }
    );
  }

  public buscarOrdenesPorMedicoYFechas(
    page: string,
    size: string,
    idMedico: number,
    fechaInicio: string,
    fechaFin: string
  ): any {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<OrdenVenta[]>(
      `${this.baseEndpoint}/${idMedico}/fechaInicio/${fechaInicio}/fechaFin/${fechaFin}`,
      { params: params }
    );
  }

  public buscarOrdenesPorMedicoYPaciente(
    page,
    size,
    idPaciente: number,
    idMedico: number
  ): any {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<OrdenVenta[]>(
      `${this.baseEndpoint}/${idMedico}/paciente/${idPaciente}`,
      { params: params }
    );
  }

  public encontrarPorUsuario(usuario: string): Observable<Medico> {
    return this.http.get<Medico>(`${this.baseEndpoint}/usuario/${usuario}`);
  }

  public aceptarUsoDeIa(medicoRadiologo: Medico): Observable<void> {
    return this.http.put<void>(`${this.baseEndpoint}/${medicoRadiologo.id}/aceptar-uso-ia`, medicoRadiologo,
      { headers: this.cabeceras });
  }

  public modificarMedicoReferentePorUsuario(
    medico: Medico
  ): Observable<Medico> {
    return this.http.put<Medico>(
      `${this.baseEndpoint}/${medico.id}/usuario`,
      medico,
      { headers: this.cabeceras }
    );
  }

  public obtenerRelacionEstudios(
    usuario: string,
    fechaInicio: string,
    fechaFin: string
  ): Observable<any> {
    return this.http.get(
      `${this.baseEndpoint}/${usuario}/relacion/${fechaInicio}/${fechaFin}`
    );
  }

  public descargarRelacionDeMedicoPDF(
    usuario: string,
    fechaInicio: string,
    fechaFin: string
  ) {
    this.http
      .get(
        `${this.baseEndpoint}/${usuario}/relacion/${fechaInicio}/${fechaFin}/excel`,
        { responseType: 'blob' }
      )
      .subscribe(
        (data: Blob) => {
          console.log('exitos');
          const blob = new Blob([data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const url = window.URL.createObjectURL(blob);
          this.alertaService.exito('Relacion generada', 'Revise sus descargas');
          window.open(url);
        },
        (error) => {
          this.alertaService.error(error);
        }
      );
  }
}
