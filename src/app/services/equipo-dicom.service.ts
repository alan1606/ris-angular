import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { EquipoDicom } from '../models/equipo-dicom';
import { BASE_ENDPOINT } from '../config/app';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipoDicomService extends CommonService<EquipoDicom>{

  protected override baseEndpoint = BASE_ENDPOINT +  '/ris/equipos-dicom';

  constructor(http: HttpClient) { 
    super(http);
  }

  public filtrarPorArea(areaId: number): Observable<EquipoDicom[]>{
    return this.http.get<EquipoDicom[]>(`${this.baseEndpoint}/area/${areaId}`);
  }

}
