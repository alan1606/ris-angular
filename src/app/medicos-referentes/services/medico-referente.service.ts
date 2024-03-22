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


}
