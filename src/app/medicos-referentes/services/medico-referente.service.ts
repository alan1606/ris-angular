import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Medico } from 'src/app/models/medico';

@Injectable({
  providedIn: 'root'
})
export class MedicoReferenteService {

  constructor(private http:HttpClient) { }


  obtenerMedicosReferentesNestjs():Observable<Medico[]>{
    return this.http.get<Medico[]>("http://localhost:3000/medicos-referentes")
  }
}
