import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VIEWER } from '../config/app';
import { VentaConceptos } from '../models/venta-conceptos';

@Injectable({
  providedIn: 'root'
})
export class SendMailService {

  private baseEndpoint = 'http://ns1.diagnocons.com/sistema/imagen/files-serverside/send_mail.php';
  private cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { 
    
  }

  public enviarCorreo(estudio: VentaConceptos, mensaje: string): Observable<number>{

    const data = {
      emailPaciente: estudio.paciente.email,
      link: `${VIEWER}/${estudio.iuid}`,
      paciente: estudio.paciente.nombreCompleto,
      estudio: estudio.concepto.concepto,
      body: mensaje,
      emailMedReferente: estudio.ordenVenta.medicoReferente.correo,
      medicoRadiologo: estudio.medicoRadiologo.correo,
      tecnicoEstudio: `${estudio.tecnico.nombres} ${estudio.tecnico.apellidos? estudio.tecnico.apellidos: ' '}`,
      ordenImg: ''
    };

    console.log(data);
    return this.http.post<number>(this.baseEndpoint, data, { headers: this.cabeceras });
  }

}
