import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../config/app';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnviarWhatsappService {
  private baseEndpoint =  BASE_ENDPOINT + '/ris/enviar-whatsapp';

  constructor(private http: HttpClient) { 
    
  }


  public enviarWhatsappResultados(ordenId: number, pacienteId: number): Observable<void>{
    return this.http.get<void>(`${this.baseEndpoint}/orden/${ordenId}/paciente/${pacienteId}`);
  }
}
