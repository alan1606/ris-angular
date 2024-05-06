import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Area } from 'src/app/models/area';
import { Cita } from 'src/app/models/cita';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  private citasDataSubject = new BehaviorSubject<Cita[]>([]);
  private areaDataSubject = new BehaviorSubject<Area>(new Area());

  citasData$: Observable<any> = this.citasDataSubject.asObservable();
  areaData$: Observable<any> = this.areaDataSubject.asObservable();


  updateCitasData(nuevasCitas: Cita[]) {
    console.log("citas en el servicio")
    this.citasDataSubject.next(nuevasCitas);
  }

  updateAreaData(nuevaArea: Area) {
    console.log("area en el servicio")
    this.areaDataSubject.next(nuevaArea);
  }
}
